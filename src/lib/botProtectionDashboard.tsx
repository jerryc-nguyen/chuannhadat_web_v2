'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Assuming this interface matches the one in botProtectionMonitor.ts
interface BotDetectionResult {
  timestamp: string;
  url: string;
  ip: string;
  userAgent: string | null;
  isBot: boolean;
  isSuspicious: boolean;
  requestDenied: boolean;
  rateLimited: boolean;
  rateLimitRemaining: number;
  suspiciousDetails: {
    isKnownSearchEngine: boolean;
    hasSuspiciousUserAgent: boolean;
    hasSuspiciousHeaders: boolean;
    hasUnusualPattern: boolean;
    matchedPatterns: string[];
  };
}

interface BotProtectionStats {
  totalRequests: number;
  botRequests: number;
  blockedRequests: number;
  rateLimitedRequests: number;
  suspiciousRequests: number;
  searchEngineRequests: number;
  verifiedSearchEngines: number;
  topBlockedIPs: Array<{ ip: string; count: number }>;
  topUserAgents: Array<{ userAgent: string; count: number }>;
  topPatterns: Array<{ pattern: string; count: number }>;
}

const calculateStats = (logs: BotDetectionResult[]): BotProtectionStats => {
  const stats: BotProtectionStats = {
    totalRequests: logs.length,
    botRequests: 0,
    blockedRequests: 0,
    rateLimitedRequests: 0,
    suspiciousRequests: 0,
    searchEngineRequests: 0,
    verifiedSearchEngines: 0,
    topBlockedIPs: [],
    topUserAgents: [],
    topPatterns: []
  };

  // Maps for counting
  const ipCount = new Map<string, number>();
  const userAgentCount = new Map<string, number>();
  const patternCount = new Map<string, number>();

  logs.forEach(log => {
    // Count bots and suspicious requests
    if (log.isBot) stats.botRequests++;
    if (log.isSuspicious) stats.suspiciousRequests++;
    if (log.requestDenied) stats.blockedRequests++;
    if (log.rateLimited) stats.rateLimitedRequests++;
    if (log.suspiciousDetails.isKnownSearchEngine) {
      stats.searchEngineRequests++;
      if (!log.isSuspicious) stats.verifiedSearchEngines++;
    }

    // Count IPs
    ipCount.set(log.ip, (ipCount.get(log.ip) || 0) + 1);

    // Count User Agents
    if (log.userAgent) {
      userAgentCount.set(log.userAgent, (userAgentCount.get(log.userAgent) || 0) + 1);
    }

    // Count patterns
    log.suspiciousDetails.matchedPatterns.forEach(pattern => {
      patternCount.set(pattern, (patternCount.get(pattern) || 0) + 1);
    });
  });

  // Sort and limit top IPs
  stats.topBlockedIPs = Array.from(ipCount.entries())
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Sort and limit top User Agents
  stats.topUserAgents = Array.from(userAgentCount.entries())
    .map(([userAgent, count]) => ({ userAgent, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Sort and limit top patterns
  stats.topPatterns = Array.from(patternCount.entries())
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return stats;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}

function truncate(str: string | null, length: number = 50): string {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export default function BotProtectionDashboard() {
  const [logs, setLogs] = useState<BotDetectionResult[]>([]);
  const [filter, setFilter] = useState<'all' | 'bots' | 'blocked'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<BotProtectionStats | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(10);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugMessage = (message: string) => {
    setDebugInfo(prev => [message, ...prev].slice(0, 20));
    console.log('[Bot Dashboard]', message);
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    addDebugMessage(`Fetching logs at ${new Date().toLocaleTimeString()}`);

    try {
      const response = await fetch('/api/bot-protection/logs');
      const data = await response.json();

      // Deduplicate logs by URL and timestamp to avoid counting the same request multiple times
      const uniqueLogMap = new Map();
      (data.logs || []).forEach((log: BotDetectionResult) => {
        const key = `${log.url}-${log.timestamp}`;
        uniqueLogMap.set(key, log);
      });

      const uniqueLogs = Array.from(uniqueLogMap.values());
      addDebugMessage(`Received ${data.logs.length} logs, deduplicated to ${uniqueLogs.length}`);

      setLogs(uniqueLogs);
      const statsData = calculateStats(uniqueLogs);
      setStats(statsData);
      addDebugMessage(`Logs retrieved: ${uniqueLogs.length} entries`);
    } catch (error) {
      console.error('Failed to fetch bot logs:', error);
      addDebugMessage(`Error fetching logs: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Manually trigger a request to the current page to ensure it's monitored
  const triggerVisitMonitoring = async () => {
    addDebugMessage(`Triggering monitoring request at ${new Date().toLocaleTimeString()}`);

    try {
      // Make a request to the dashboard page to create a monitoring entry
      const dashboardUrl = `${window.location.origin}/bot-protection-dashboard?monitored=true&t=${Date.now()}`;
      const response = await fetch(dashboardUrl);

      if (response.ok) {
        addDebugMessage('Monitoring request successful');
      } else {
        addDebugMessage(`Monitoring request failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to trigger monitoring:', error);
      addDebugMessage(`Error sending monitoring request: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Force a direct page navigation to trigger middleware
  const triggerDirectNavigation = () => {
    addDebugMessage('Triggering direct navigation');
    window.location.href = `${window.location.pathname}?refresh=${Date.now()}`;
  };

  useEffect(() => {
    addDebugMessage('Component mounted');

    // Set a flag to prevent infinite reloads on initial load
    const hasReloaded = sessionStorage.getItem('dashboardReloaded');
    if (!hasReloaded) {
      addDebugMessage('First load - performing hard refresh to trigger middleware');
      sessionStorage.setItem('dashboardReloaded', 'true');
      // Add a small delay before triggering the navigation
      setTimeout(() => {
        triggerDirectNavigation();
      }, 500);
      return;
    }

    fetchLogs();
    triggerVisitMonitoring();

    // Set up auto-refresh
    if (refreshInterval) {
      addDebugMessage(`Auto-refresh enabled: ${refreshInterval}s interval`);
      const interval = setInterval(() => {
        addDebugMessage('Auto-refresh triggered');
        fetchLogs();
        triggerVisitMonitoring();
      }, refreshInterval * 1000);

      return () => {
        clearInterval(interval);
        addDebugMessage('Auto-refresh cleared');
      };
    }
  }, [refreshInterval]);

  const filteredLogs = logs.filter(log => {
    if (filter === 'bots') return log.isBot;
    if (filter === 'blocked') return log.requestDenied;
    return true;
  });

  const toggleRefresh = () => {
    if (refreshInterval) {
      addDebugMessage('Auto-refresh disabled');
      setRefreshInterval(null);
    } else {
      addDebugMessage('Auto-refresh enabled (10s)');
      setRefreshInterval(10); // Refresh every 10 seconds
    }
  };

  const clearAllLogs = async () => {
    addDebugMessage('Clearing all logs');
    try {
      await fetch('/api/bot-protection/logs', { method: 'DELETE' });
      setLogs([]);
      setStats(calculateStats([]));
      addDebugMessage('Logs cleared successfully');
    } catch (error) {
      console.error('Failed to clear logs:', error);
      addDebugMessage(`Error clearing logs: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bot Protection Dashboard</h1>
        <div className="space-x-2">
          <Button
            variant={refreshInterval ? "destructive" : "default"}
            onClick={toggleRefresh}
          >
            {refreshInterval ? "Stop Auto-refresh" : "Auto-refresh"}
          </Button>
          <Button onClick={fetchLogs}>Refresh Now</Button>
          <Button variant="secondary" onClick={triggerDirectNavigation}>Hard Refresh</Button>
          <Button variant="outline" onClick={clearAllLogs}>Clear Logs</Button>
        </div>
      </div>

      {/* Debug Panel */}
      <div className="mb-8 border border-amber-200 bg-amber-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Debugging Panel</h3>
          <span className="text-sm text-gray-500">Total Records: {logs.length} | Stats Total: {stats?.totalRequests || 0}</span>
        </div>
        <div className="max-h-32 overflow-y-auto text-xs font-mono bg-black text-green-400 p-2 rounded">
          {debugInfo.map((msg, i) => (
            <div key={i}>{`> ${msg}`}</div>
          ))}
          {debugInfo.length === 0 && <div>No debug messages yet</div>}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bot Requests</p>
                  <p className="text-2xl font-bold">{stats.botRequests}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blocked</p>
                  <p className="text-2xl font-bold text-red-500">{stats.blockedRequests}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rate Limited</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats.rateLimitedRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Search Engines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Search Engine Requests</p>
                  <p className="text-2xl font-bold">{stats.searchEngineRequests}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verified Search Engines</p>
                  <p className="text-2xl font-bold text-green-500">{stats.verifiedSearchEngines}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spoofed Search Engines</p>
                  <p className="text-2xl font-bold text-red-500">
                    {stats.searchEngineRequests - stats.verifiedSearchEngines}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pattern Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topPatterns.slice(0, 5).map((pattern, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <Badge variant="outline">{pattern.pattern}</Badge>
                    <span className="font-mono">{pattern.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="logs" className="w-full">
        <TabsList>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="ips">Top IPs</TabsTrigger>
          <TabsTrigger value="agents">Top User Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <div className="mb-4 flex justify-between items-center">
            <div className="space-x-2">
              <Button
                variant={filter === 'all' ? "default" : "outline"}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'bots' ? "default" : "outline"}
                onClick={() => setFilter('bots')}
              >
                Bots Only
              </Button>
              <Button
                variant={filter === 'blocked' ? "default" : "outline"}
                onClick={() => setFilter('blocked')}
              >
                Blocked Only
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {logs.length} requests
            </p>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User Agent</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Patterns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      {isLoading ? 'Loading logs...' : 'No logs found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.slice(0, 100).map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {log.ip}
                      </TableCell>
                      <TableCell>
                        {log.requestDenied ? (
                          <Badge variant="destructive">Blocked</Badge>
                        ) : log.isSuspicious ? (
                          <Badge variant="outline">Suspicious</Badge>
                        ) : log.isBot ? (
                          <Badge variant="secondary">Bot</Badge>
                        ) : (
                          <Badge variant="secondary">Allowed</Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">
                        {truncate(log.userAgent)}
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">
                        {log.url}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {log.suspiciousDetails.matchedPatterns.map((pattern, i) => (
                            <Badge key={i} variant="outline">{pattern}</Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="ips">
          {stats && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Requests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topBlockedIPs.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.ip}</TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="agents">
          {stats && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Agent</TableHead>
                    <TableHead>Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topUserAgents.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="max-w-[500px] truncate">
                        {item.userAgent}
                      </TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
