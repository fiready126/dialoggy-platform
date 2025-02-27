
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompanyData } from "@/types/chat";
import { Download, ExternalLink, Building, User, Globe } from "lucide-react";
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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Companies Found ({companies.length})</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadAsExcel}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" /> 
          Export
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">CEO</th>
              <th className="px-4 py-2 text-left">Website</th>
              <th className="px-4 py-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr 
                key={company.id} 
                onClick={() => handleRowClick(company)}
                className="border-t hover:bg-muted/50 cursor-pointer"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  {company.name}
                </td>
                <td className="px-4 py-3">{company.position || "-"}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {company.ceo}
                </td>
                <td className="px-4 py-3">
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="h-4 w-4" />
                    Visit
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </td>
                <td className="px-4 py-3">{company.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
