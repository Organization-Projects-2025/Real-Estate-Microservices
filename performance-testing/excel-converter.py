import pandas as pd
import sys
import os
from datetime import datetime

def convert_to_excel(jtl_file):
    if not os.path.exists(jtl_file):
        print(f"Error: File {jtl_file} not found")
        return False
    
    try:
        df = pd.read_csv(jtl_file)
        if df.empty:
            print(f"Warning: {jtl_file} is empty")
            return False
            
        df['DateTime'] = pd.to_datetime(df['timeStamp'], unit='ms')
        df['Success'] = df['success'].astype(bool)
        
        # Summary stats
        total = len(df)
        success = df['Success'].sum()
        success_rate = (success / total * 100) if total > 0 else 0
        avg_time = df['elapsed'].mean()
        min_time = df['elapsed'].min()
        max_time = df['elapsed'].max()
        p95_time = df['elapsed'].quantile(0.95)
        
        # Throughput calculation (requests per second)
        duration = (df['timeStamp'].max() - df['timeStamp'].min()) / 1000  # Convert to seconds
        throughput = total / duration if duration > 0 else 0
        
        summary = pd.DataFrame({
            'Metric': ['Total Requests', 'Successful', 'Failed', 'Success Rate (%)', 
                      'Avg Response Time (ms)', 'Min (ms)', 'Max (ms)', '95th Percentile (ms)',
                      'Throughput (req/sec)', 'Test Duration (sec)'],
            'Value': [total, success, total-success, f'{success_rate:.2f}', f'{avg_time:.2f}', 
                     min_time, max_time, f'{p95_time:.2f}', f'{throughput:.2f}', f'{duration:.2f}']
        })
        
        # Performance by endpoint
        endpoint_stats = df.groupby('label').agg({
            'elapsed': ['count', 'mean', 'min', 'max', lambda x: x.quantile(0.95)],
            'success': 'sum'
        }).round(2)
        endpoint_stats.columns = ['Count', 'Avg (ms)', 'Min (ms)', 'Max (ms)', '95th (ms)', 'Success']
        endpoint_stats['Success Rate (%)'] = (endpoint_stats['Success'] / endpoint_stats['Count'] * 100).round(2)
        
        excel_file = jtl_file.replace('.jtl', '_performance.xlsx')
        with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
            summary.to_excel(writer, sheet_name='Summary', index=False)
            endpoint_stats.to_excel(writer, sheet_name='By Endpoint')
            df.to_excel(writer, sheet_name='Raw Data', index=False)
        
        print(f"✓ Excel report generated: {excel_file}")
        return True
        
    except Exception as e:
        print(f"Error processing {jtl_file}: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 excel-converter.py <jtl_file>")
        sys.exit(1)
    convert_to_excel(sys.argv[1])