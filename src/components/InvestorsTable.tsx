
import React from "react";
import { Button } from "@/components/ui/button";
import { InvestorData } from "@/types/chat";
import { Download, TrendingUp, Building, Globe, DollarSign } from "lucide-react";
import * as XLSX from 'xlsx';

interface InvestorsTableProps {
  investors: InvestorData[];
}

export const InvestorsTable = ({ investors }: InvestorsTableProps) => {
  const downloadAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(investors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Investors");
    XLSX.writeFile(workbook, "investor-list.xlsx");
  };

  return (
    <div className="w-full mt-2 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
          Investors ({investors.length})
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadAsExcel}
          className="flex items-center gap-1 rounded-full px-4 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 transition-colors"
        >
          <Download className="h-4 w-4" /> 
          Export to Excel
        </Button>
      </div>
      
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Investor Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Company</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Country</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Funding</th>
              </tr>
            </thead>
            <tbody>
              {investors.map((investor, index) => (
                <tr 
                  key={investor.id}
                  className={`border-t hover:bg-green-50/50 dark:hover:bg-green-900/20 cursor-pointer transition-colors ${
                    index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-gray-50/50 dark:bg-slate-900/50'
                  }`}
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-md">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium">{investor.name}</span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-md">
                      <Building className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    {investor.companyName}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                      <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    {investor.country}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-md">
                      <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    {investor.funding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
