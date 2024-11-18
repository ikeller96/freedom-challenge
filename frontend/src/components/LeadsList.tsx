import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLeads, Lead } from "../api/leadService";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "./catalyst/table";
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "./catalyst/pagination";
import { Heading } from "./catalyst/heading";
import { formatPhoneNumber } from "../utils/helperFunctions";

const LeadsList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const defaultPage = parseInt(queryParams.get("page") || "1", 10);
  const [page, setPage] = useState(defaultPage);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads(search, page, 20);
        if (response.data) {
          setLeads(response.data.data || []);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, [search, page]);

  const updatePage = (newPage: number) => {
    setPage(newPage);
    navigate(`?page=${newPage}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(page - 2, 1);
    const endPage = Math.min(page + 2, totalPages);

    if (startPage > 1) {
      pages.push(
        <PaginationPage key={1} href={`?page=1`} current={page === 1}>
          1
        </PaginationPage>
      );

      if (startPage > 2) {
        pages.push(<PaginationGap key="start-gap" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationPage key={i} href={`?page=${i}`} current={page === i}>
          {i}
        </PaginationPage>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<PaginationGap key="end-gap" />);
      }

      pages.push(
        <PaginationPage
          key={totalPages}
          href={`?page=${totalPages}`}
          current={page === totalPages}
        >
          {totalPages}
        </PaginationPage>
      );
    }

    return pages;
  };

  return (
    <div className="p-6 bg-gray-800 text-white min-h-screen">
      <Heading>Leads</Heading>
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="my-4 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 min-w-80"
      />
      <Table striped className="w-full text-left text-sm">
        <TableHead>
          <TableRow>
            <TableHeader className="border-b border-gray-600">Name</TableHeader>
            <TableHeader className="border-b border-gray-600">
              Email
            </TableHeader>
            <TableHeader className="border-b border-gray-600">
              Phone
            </TableHeader>
            <TableHeader className="border-b border-gray-600">
              Status
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="hover:bg-gray-700">
              <TableCell className="border-b border-gray-700">
                {lead.name}
              </TableCell>
              <TableCell className="border-b border-gray-700">
                {lead.email}
              </TableCell>
              <TableCell className="border-b border-gray-700">
                {formatPhoneNumber(lead.phone)}
              </TableCell>
              <TableCell className="border-b border-gray-700">
                {lead.status?.name || "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-6">
        <PaginationPrevious href={page > 1 ? `?page=${page - 1}` : null} />
        <PaginationList>{renderPageNumbers()}</PaginationList>
        <PaginationNext href={page < totalPages ? `?page=${page + 1}` : null} />
      </Pagination>
    </div>
  );
};

export default LeadsList;
