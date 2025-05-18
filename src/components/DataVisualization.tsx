import React from 'react';
import { ChartType, getValueField } from '@/utils/chartUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { SearchX } from 'lucide-react';

interface DataVisualizationProps {
  data: any[] | null;
  dataType: 'sales' | 'inventory';
  title?: string;
  selections: any;
  setSelections: React.Dispatch<React.SetStateAction<any>>;
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-80">
    <SearchX className="h-16 w-16 text-gray-300 mb-4" />
    <h3 className="text-xl font-medium text-gray-600 mb-2">No Data to Display</h3>
    <p className="text-gray-500 text-center max-w-md">
      Select dimension options and click <strong>Apply Filters</strong> to visualize your data.
    </p>
  </div>
);

const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  dataType,
  title = 'Data Visualization',
  selections,
  setSelections
}) => {
  const valueField = getValueField(dataType);
  const valueFieldTitle = dataType === 'sales' ? 'Revenue' : 'Stock Level';

  const handleFilterChange = (key: string, value: string) => {
    setSelections((prev: any) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value
      }
    }));
  };

  const filters = selections.filters || {};

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <EmptyState />
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  // 👉 Tạo unique values cho từng cột
  const columnOptions: Record<string, string[]> = {};
  headers.forEach((key) => {
    const uniqueValues = Array.from(new Set(data.map((d) => String(d[key] ?? ''))));
    columnOptions[key] = uniqueValues.sort();
  });

  return (
    <div className="chart-container">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="data-table w-full overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            {/* Header Row */}
            <TableRow>
              {headers.map((key) => (
                <TableHead key={key} className={key === valueField ? 'text-right' : ''}>
                  {key === valueField ? valueFieldTitle : key}
                </TableHead>
              ))}
            </TableRow>

            {/* Filter Dropdown Row */}
            <TableRow>
              {headers.map((key) => (
                <TableCell key={key} className={key === valueField ? 'text-right' : ''}>
                  <select
                    value={filters[key] || ''}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="">All</option>
                    {columnOptions[key].map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Data Rows */}
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {headers.map((key) => (
                  <TableCell
                    key={key}
                    className={key === valueField ? 'text-right font-medium' : ''}
                  >
                    {key === valueField && typeof row[key] === 'number'
                      ? new Intl.NumberFormat('en-US').format(row[key])
                      : String(row[key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="text-xs text-gray-500 p-2">
          Showing {data.length} of {data.length} record(s)
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
