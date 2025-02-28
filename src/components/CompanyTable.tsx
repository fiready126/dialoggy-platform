
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompanyData } from "@/types/chat";
import { Download, ExternalLink, Building, User, Globe, ChevronRight, Filter } from "lucide-react";
import { CompanyModal } from "./CompanyModal";
import * as XLSX from 'xlsx';

interface CompanyTableProps {
  companies: CompanyData[];
}

export const CompanyTable = ({ companies }: CompanyTableProps) => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (company: CompanyData) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const downloadAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(companies);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    XLSX.writeFile(workbook, "company-list.xlsx");
  };

  return (
    <div className="w-full mt-2 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="h-4 w-4 mr-2 text-blue-500" />
          Results ({companies.length})
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadAsExcel}
          className="flex items-center gap-1 rounded-full px-4 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 transition-colors"
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
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Position</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">CEO</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Website</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Location</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 w-[50px]">View</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr 
                  key={company.id} 
                  onClick={() => handleRowClick(company)}
                  className={`border-t hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors ${
                    index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-gray-50/50 dark:bg-slate-900/50'
                  }`}
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-md">
                      <Building className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-medium">{company.name}</span>
                  </td>
                  <td className="px-4 py-3">{company.position || "-"}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-md">
                      <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    {company.ceo}
                  </td>
                  <td className="px-4 py-3">
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                        <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      Website
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </td>
                  <td className="px-4 py-3">{company.location}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors inline-flex">
                      <ChevronRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCompany && (
        <CompanyModal 
          company={selectedCompany} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};
