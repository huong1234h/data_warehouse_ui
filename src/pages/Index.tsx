
import React, { useState, useEffect } from 'react';
import { 
  fetchData, 
  DataRequest, 
  TIME_DIMENSIONS, 
  CUSTOMER_DIMENSIONS, 
  ITEM_DIMENSIONS,  
  STORE_DIMENSIONS
} from '@/services/api';
import FilterCard from '@/components/FilterCard';
import DataVisualization from '@/components/DataVisualization';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Index = () => {
  // State for data type (sales/inventory)
  const [dataType, setDataType] = useState<'sales' | 'inventory'>('sales');
  
  // State for visualization
  const [visualizationData, setVisualizationData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for dimension selections
  const [selections, setSelections] = useState({
    time: { level: '[]', display: TIME_DIMENSIONS['[]'].display , filter: ''},
    customer: { level: '[]', display: CUSTOMER_DIMENSIONS.sales['[]'].display, filter: '' },
    item: { level: '[]', display: ITEM_DIMENSIONS['[]'].display , filter: ''},
    geo: { level: '[]', display: STORE_DIMENSIONS['[]'].display, filter: '' },
    filters: {}
  });
  
  // When data type changes, reset customer dimension
  useEffect(() => {
    setSelections(prev => ({
      ...prev,
      customer: { 
        level: '[]', 
        display: CUSTOMER_DIMENSIONS[dataType]['[]'].display,
        filter: '' // Ensure the filter property is included
      }
    }));
    // Reset visualization data too
    setVisualizationData(null);
  }, [dataType]);
  
  // Handle dimension selection change
  const handleDimensionChange = (dimension: 'time' | 'customer' | 'item' | 'geo', value: string) => {
    const dimensions = dimension === 'time' 
      ? TIME_DIMENSIONS 
      : dimension === 'customer' 
        ? CUSTOMER_DIMENSIONS[dataType] 
        : dimension === 'item' 
          ? ITEM_DIMENSIONS 
          : STORE_DIMENSIONS;
          
    setSelections({
      ...selections,
      [dimension]: {
        level: value,
        display: dimensions[value].display
      }
    });
  };
  
  // Apply filters and fetch data
  const fetchVisualizationData = async (
    type = dataType,
    selectedDimensions = selections,
  ) => {
    setIsLoading(true);
    
    try {
      const request: DataRequest = {
        dataType: type,
        time: TIME_DIMENSIONS[selectedDimensions.time.level].id,
        customer: CUSTOMER_DIMENSIONS[type][selectedDimensions.customer.level].id,
        item: ITEM_DIMENSIONS[selectedDimensions.item.level].id,
        geo: STORE_DIMENSIONS[selectedDimensions.geo.level].id,
        filters: selectedDimensions.filters,
      };
  
      console.log("Request:", request);
      console.log( selectedDimensions);
      
      const response = await fetchData(request);
      
      if (response.success) {
        console.log(response.data);
        setVisualizationData(response.data);
        toast.success("Data loaded successfully");
      } else {
        toast.error(response.message || "Failed to load data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  // Generate chart title

  return (
    <div className="container py-8 px-4 mx-auto max-w-7xl">
      {/* Filter Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          <i className="mr-2">🔍</i> Filter Controls
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Time Dimension */}
          <FilterCard
            title="Time Dimension"
            type="time"
            options={TIME_DIMENSIONS}
            value={selections.time.level}
            onChange={(value) => handleDimensionChange('time', value)}
          />
          
          {/* Customer/Store Dimension (dynamic based on data type) */}
          <FilterCard
            title={dataType === 'sales' ? "Customer Dimension" : "Store Dimension"}
            type="customer"
            options={CUSTOMER_DIMENSIONS[dataType]}
            value={selections.customer.level}
            onChange={(value) => handleDimensionChange('customer', value)}
            dataType={dataType}
          />
          
          {/* Item Dimension */}
          <FilterCard
            title="Product Dimension"
            type="item"
            options={ITEM_DIMENSIONS}
            value={selections.item.level}
            onChange={(value) => handleDimensionChange('item', value)}
          />
          
          {/* Geography Dimension */}
          <FilterCard
            title="Store Dimension"
            type="geo"
            options={STORE_DIMENSIONS}
            value={selections.geo.level}
            onChange={(value) => handleDimensionChange('geo', value)}
          />
        </div>
      </div>
      
      {/* Apply Button and Chart Type Selection */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <Button 
            onClick={() => fetchVisualizationData()}
            disabled={isLoading}
            className="w-full py-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>🚀 Apply Filters & Visualize</>
            )}
          </Button>
        </div>
        <div>
        </div>
      </div>
      
      {/* Data Visualization */}
      <DataVisualization
        selections={selections}
        setSelections={setSelections}
        data={visualizationData} 
        dataType={dataType}
        title={"Table for demo"}
      />
    </div>
  );
};

export default Index;
