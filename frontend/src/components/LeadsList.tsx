import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLeads, Lead, createLead, updateLead } from "../api/leadService";
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
import { Button } from "./catalyst/button";
import LeadFormModal from "./LeadFormModal";

const LeadsList: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [statuses, setStatuses] = useState<{ id: number; name: string }[]>([]);
    const [notification, setNotification] = useState<string | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const defaultPage = parseInt(queryParams.get("page") || "1", 10);
    const [page, setPage] = useState(defaultPage);

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

    const fetchStatuses = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/lead-statuses");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setStatuses(data || []);
        } catch (error) {
            console.error("Error fetching lead statuses:", error);
        }
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [search, page]);

    const openModal = (lead?: Lead) => {
        setSelectedLead(lead || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLead(null);
    };

    const handleFormSubmit = async (data: {
        name: string;
        email: string;
        phone: string;
        lead_status_id: number;
    }) => {
        try {
            if (selectedLead) {
                await updateLead(selectedLead.id, data);
                setNotification("Lead updated successfully!");
            } else {
                await createLead(data);
                setNotification("Lead created successfully!");
            }
            fetchLeads();
            closeModal();
        } catch (error) {
            console.error("Error saving lead:", error);
        } finally {
            // Automatically hide notification after a few seconds
            setTimeout(() => setNotification(null), 3000);
        }
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
                <PaginationPage
                    key={i}
                    href={`?page=${i}`}
                    current={page === i}
                >
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
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="my-4 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 min-w-80"
                />
                <Button onClick={() => openModal()}>Add New Lead</Button>
            </div>
            {notification && (
                <div className="bg-green-500 text-white p-2 mb-4 rounded">
                    {notification}
                </div>
            )}
            <Table striped className="w-full text-left text-sm">
                <TableHead>
                    <TableRow>
                        <TableHeader className="border-b border-gray-600">
                            Name
                        </TableHeader>
                        <TableHeader className="border-b border-gray-600">
                            Email
                        </TableHeader>
                        <TableHeader className="border-b border-gray-600">
                            Phone
                        </TableHeader>
                        <TableHeader className="border-b border-gray-600">
                            Status
                        </TableHeader>
                        <TableHeader className="border-b border-gray-600">
                            Actions
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
                            <TableCell className="border-b border-gray-700">
                                <Button onClick={() => openModal(lead)}>
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination className="mt-6">
                <PaginationPrevious
                    href={page > 1 ? `?page=${page - 1}` : null}
                />
                <PaginationList>{renderPageNumbers()}</PaginationList>
                <PaginationNext
                    href={page < totalPages ? `?page=${page + 1}` : null}
                />
            </Pagination>
            {isModalOpen && (
                <LeadFormModal
                    lead={selectedLead}
                    statuses={statuses}
                    onClose={closeModal}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default LeadsList;