import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLeads, Lead } from '../api/leadService';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeader,
    TableCell
} from './catalyst-ui-kit/typescript/table';
import {
    Pagination,
    PaginationGap,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from './catalyst-ui-kit/typescript/pagination';
import { Heading } from './catalyst-ui-kit/typescript/heading';

const LeadsList: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1); // Track the total number of pages

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '1', 10); // Default to page 1 if not specified

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await getLeads(search, page, 10); // Assuming 10 leads per page
                setLeads(response.data.data);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching leads:", error);
            }
        };

        fetchLeads();
    }, [search, page]);

    const updatePage = (newPage: number) => {
        navigate(`?page=${newPage}`);
    };

    return (
        <div className="p-6 bg-gray-800 text-white min-h-screen">
            <Heading>Leads</Heading>
            <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="my-4 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            />
            <Table striped className="w-full text-left text-sm">
                <TableHead>
                    <TableRow>
                        <TableHeader className="border-b border-gray-600">Name</TableHeader>
                        <TableHeader className="border-b border-gray-600">Email</TableHeader>
                        <TableHeader className="border-b border-gray-600">Phone</TableHeader>
                        <TableHeader className="border-b border-gray-600">Status</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {leads.map((lead) => (
                        <TableRow key={lead.id} className="hover:bg-gray-700">
                            <TableCell className="border-b border-gray-700">{lead.name}</TableCell>
                            <TableCell className="border-b border-gray-700">{lead.email}</TableCell>
                            <TableCell className="border-b border-gray-700">{lead.phone}</TableCell>
                            <TableCell className="border-b border-gray-700">{lead.lead_status_id}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* <Pagination className="mt-6 flex justify-center">
                <PaginationPrevious
                    href={page > 1 ? `?page=${page - 1}` : null}
                />
                <PaginationList>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationPage
                            key={i + 1}
                            href={`?page=${i + 1}`}
                            current={page === i + 1}
                        >
                            {i + 1}
                        </PaginationPage>
                    ))}
                    {totalPages > 5 && <PaginationGap />}
                </PaginationList>
                <PaginationNext
                    href={page < totalPages ? `?page=${page + 1}` : null}
                />
            </Pagination> */}
        </div>
    );
};

export default LeadsList;