
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompanyData } from "@/types/chat";
import { Download, ExternalLink, Building, User, Globe, ChevronRight, Filter, Briefcase, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { CompanyModal } from "./CompanyModal";
import * as XLSX from 'xlsx';

interface CompanyTableProps {
  companies: CompanyData[];
  onFindJobs?: (companyName: string) => void;
  onFindInvestors?: (companyName: string) => void;
}

export const CompanyTable = ({ companies, onFindJobs, onFindInvestors }: CompanyTableProps) => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof CompanyData | null | 'rank'>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  const handleFindJobs = (e: React.MouseEvent, companyName: string) => {
    e.stopPropagation();
    if (onFindJobs) {
      onFindJobs(companyName);
    }
  };

  const handleFindInvestors = (e: React.MouseEvent, companyName: string) => {
    e.stopPropagation();
    if (onFindInvestors) {
      onFindInvestors(companyName);
    }
  };

  const handleSort = (field: keyof CompanyData | 'rank') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === 'rank') {
      const rankA = a.leadScores?.rank || 0;
      const rankB = b.leadScores?.rank || 0;
      return sortDirection === 'asc' 
        ? rankA - rankB 
        : rankB - rankA;
    }
    
    let fieldA: any = sortField === 'leadScores' ? a.leadScores?.rank : a[sortField];
    let fieldB: any = sortField === 'leadScores' ? b.leadScores?.rank : b[sortField];
    
    if (fieldA === undefined) fieldA = '';
    if (fieldB === undefined) fieldB = '';
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    
    return sortDirection === 'asc' 
      ? (fieldA > fieldB ? 1 : -1)
      : (fieldA < fieldB ? 1 : -1);
  });
  
  const SortIcon = ({ field }: { field: keyof CompanyData | 'rank' }) => (
    <span className="ml-1 inline-flex">
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <div className="h-3 w-3"></div>
      )}
    </span>
  );

  const renderSortableHeader = (field: keyof CompanyData | 'rank', label: string) => (
    <th 
      className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

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
                {renderSortableHeader('rank', 'Rank')}
                {renderSortableHeader('name', 'Name')}
                {renderSortableHeader('position', 'Position')}
                {renderSortableHeader('ceo', 'CEO')}
                {renderSortableHeader('website', 'Website')}
                {renderSortableHeader('location', 'Location')}
                <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300" colSpan={3}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.map((company, index) => {
                const rankScore = company.leadScores?.rank || 0;
                const rankByScore = sortedCompanies
                  .slice()
                  .sort((a, b) => (b.leadScores?.rank || 0) - (a.leadScores?.rank || 0))
                  .findIndex(c => c.id === company.id) + 1;
                
                return (
                  <tr 
                    key={company.id} 
                    onClick={() => handleRowClick(company)}
                    className={`border-t hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-gray-50/50 dark:bg-slate-900/50'
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50">
                        <span className="text-xs font-medium text-blue-800 dark:text-blue-300">{rankByScore}</span>
                      </div>
                    </td>
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
                    <td className="px-2 py-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-800/50"
                        onClick={(e) => handleFindJobs(e, company.name)}
                      >
                        <Briefcase className="h-4 w-4 mr-1" />
                        Find Jobs
                      </Button>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full bg-green-50 text-green-600 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-800/50"
                        onClick={(e) => handleFindInvestors(e, company.name)}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Find Investors
                      </Button>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors inline-flex">
                        <ChevronRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCompany && (
        <CompanyModal 
          company={selectedCompany} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onFindJobs={onFindJobs}
          onFindInvestors={onFindInvestors}
        />
      )}
    </div>
  );
};
