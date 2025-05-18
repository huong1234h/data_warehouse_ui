
// This file simulates API calls to fetch data from a backend
import { toast } from "sonner";

// Types
export interface DataRequest {
  dataType: 'sales' | 'inventory';
  time: number;
  customer: number;
  item: number;
  geo: number;
  filters?: Record<string, any>; // <--- thêm filters
}


export interface DataResponse {
  data: any[];
  columns: string[];
  success: boolean;
  message?: string;
}

// Constants for dimensions
export const TIME_DIMENSIONS = {
  '[]': { id: 0, display: 'All Time' },
  '["Year"]': { id: 1, display: 'Year'},
  '["Quater"]': { id: 2, display: 'Quarter'},
  '["Month"]': { id: 3, display: 'Month' }
};

export const CUSTOMER_DIMENSIONS = {
  sales: {
    '[]': { id: 0, display: 'All Customers' },
    '["Customer Type"]': { id: 1, display: 'Customer Type' },
    '["City Key"]': { id: 1, display: 'City Key' },
    '["Customer Name"]': { id: 1, display: 'Customer Name' },
  },
  inventory: {
    '[]': { id: 0, display: 'All Stores' },
    '["Customer Name"]': { id: 1, display: 'Store Code' }
  }
};

export const ITEM_DIMENSIONS = {
  '[]': { id: 0, display: 'All Items' },
  '["Ma Mat Hang"]': { id: 3, display: 'Product Code' },
};

export const STORE_DIMENSIONS = {
  '[]': { id: 0, display: 'All Store' },
  '["Store Key"]': { id: 1, display: 'Store Key' },
  '["City Key"]': { id: 2, display: 'City Key' }
};

// Mock data generation
export const fetchData = async (request: DataRequest): Promise<DataResponse> => {
  try {
    // In production, this would be a real API call
    // For now, we'll simulate it with a delay and mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockData = generateMockData(request);
    
    return {
      data: mockData,
      columns: Object.keys(mockData[0] || {}),
      success: true
    };
  } catch (error) {
    toast.error("Failed to fetch data");
    console.error("API Error:", error);
    return {
      data: [],
      columns: [],
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

// Helper function to generate mock data
function generateMockData(request: DataRequest) {
  const { dataType, time, customer, item, geo, filters = {} } = request;

  const valueField = dataType === 'sales' ? 'revenue' : 'stock';
  const dimensions: string[] = [];

  // Build dimensions (giữ nguyên như bạn đã làm)
  if (time > 0) {
    if (time === 1) dimensions.push('Year');
    if (time === 2) dimensions.push('Quarter');
    if (time === 3) dimensions.push('Month');
  }

  if (customer > 0) {
    dimensions.push(dataType === 'sales' ? 'CustomerType' : 'StoreCode');
  }

  if (item > 0) {
    if (item === 1) dimensions.push('Size');
    if (item === 2) dimensions.push('WeightRange');
    if (item === 3) dimensions.push('ProductCode');
    if (item === 4) dimensions.push('Size', 'WeightRange');
  }

  if (geo > 0) {
    if (geo === 1) dimensions.push('State');
    if (geo === 2) dimensions.push('State', 'City');
  }

  const result = [];
  const count = Math.min(20, Math.max(5, dimensions.length * 3));
  
  for (let i = 0; i < count; i++) {
    const record: Record<string, any> = {};

    // Populate record
    dimensions.forEach(dim => {
      if (dim === 'Year') record[dim] = 2020 + Math.floor(i % 5);
      else if (dim === 'Quarter') record[dim] = `Q${1 + Math.floor(i % 4)}`;
      else if (dim === 'Month') record[dim] = `Month ${1 + Math.floor(i % 12)}`;
      else if (dim === 'CustomerType') record[dim] = `Type ${1 + Math.floor(i % 3)}`;
      else if (dim === 'StoreCode') record[dim] = `Store ${10 + i}`;
      else if (dim === 'Size') record[dim] = ['S', 'M', 'L', 'XL'][i % 4];
      else if (dim === 'WeightRange') record[dim] = `${(i % 3 + 1) * 5}-${(i % 3 + 2) * 5}kg`;
      else if (dim === 'ProductCode') record[dim] = `PROD-${1000 + i}`;
      else if (dim === 'State') record[dim] = `State ${String.fromCharCode(65 + (i % 10))}`;
      else if (dim === 'City') record[dim] = `City ${i + 1}`;
    });

    record[valueField] = Math.round(Math.random() * 10000) * (1 + i % 10);
    result.push(record);
  }

  // ✅ Apply filters here
  const filteredResult = result.filter(row => {
    return Object.entries(filters).every(([key, value]) => {
      return row[key] === value;
    });
  });

  console.log(filteredResult);
  console.log(result);

  return filteredResult.length > 0 ? filteredResult : result; // fallback if no match
}

