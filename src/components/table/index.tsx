import React, { useState, useEffect } from 'react';

interface DataType {
  [key: string]: any;
}

interface Column {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: 'left' | 'right' | 'center';
  render?: (value: any, row: DataType, rowIndex: number) => React.ReactNode;
}

interface TableComponentProps {
  data: any[];
  columns: Column[];
  title?: string;
  footer?: React.ReactNode;
}

const TableComponent: React.FC<TableComponentProps> = ({ columns, data, title, footer }) => {
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 450);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 450);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle: React.CSSProperties = {
    overflowX: 'auto',
    width: '100%',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const noDataStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '20px',
    color: '#6b7280',
    fontSize: '1rem',
    fontWeight: '500',
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
      <div style={containerStyle}>
        <table style={tableStyle} className="divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width, padding: '12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={noDataStyle}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row.key}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ width: col.width, padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}
                    >
                      {col.render ? col.render(row[col.dataIndex], row, rowIndex) : row[col.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {footer && (
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={columns.length} style={{ padding: '12px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                  {footer}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
