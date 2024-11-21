import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    getLeads,
    Lead,
    createLead,
    updateLead,
    deleteLead,
    fetchStatuses,
} from "../api/leadService";
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
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import LeadFormModal from "./LeadFormModal";
import {
    Dropdown,
    DropdownButton,
    DropdownItem,
    DropdownMenu,
} from "./catalyst/dropdown";
import LeadsTable from "./LeadsTable";
import debounce from "lodash/debounce";
import { Spinner } from "./Spinner";

const LeadsList: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [statuses, setStatuses] = useState<{ id: number; name: string }[]>(
        []
    );
    const [notification, setNotification] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const defaultPage = parseInt(queryParams.get("page") || "1", 10);
    const [page, setPage] = useState(defaultPage);

    const debouncedSetSearch = useCallback(
        debounce((value: string) => {
            setDebouncedSearch(value);
        }, 100),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim() === "") {
            setPage(1);
            setDebouncedSearch("");
        } else {
            debouncedSetSearch(value);
        }
    };

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = {
                search: debouncedSearch,
                page,
                limit: 20,
                ...(sortBy && { sortBy }),
                ...(sortBy && { sortDirection }),
                ...(selectedStatus !== null && {
                    lead_status_id: selectedStatus,
                }),
            };

            const response = await getLeads(params);
            if (response.data) {
                setLeads(response.data.data || []);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false); // Hide the spinner
        }
    };

    const initializeStatuses = async () => {
        try {
            const data = await fetchStatuses();
            setStatuses(data);
        } catch (error) {
            console.error("Failed to initialize statuses:", error);
        }
    };

    useEffect(() => {
        initializeStatuses();
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [debouncedSearch, page, sortBy, sortDirection, selectedStatus]);

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
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleSortChange = (field: string) => {
        if (sortBy === field) {
            // Toggle sort direction
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortDirection("asc");
        }
    };

    const handleStatusFilter = (statusId: number | null) => {
        setSelectedStatus((prev) => {
            return statusId === prev ? null : statusId;
        });
        setPage(1); // Reset to first page
    };

    const handleDeleteLead = async (leadId: number) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to delete this lead?")) {
            try {
                await deleteLead(leadId);
                setNotification("Lead deleted successfully!");
                fetchLeads();
            } catch (error) {
                console.error("Error deleting lead:", error);
            } finally {
                setTimeout(() => setNotification(null), 3000);
            }
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(page - 2, 1);
        const endPage = Math.min(page + 2, totalPages);

        const handlePageClick = (pageNumber: number) => {
            setPage(pageNumber);
        };

        if (startPage > 1) {
            pages.push(
                <PaginationPage
                    key={1}
                    current={page === 1}
                    onClick={() => handlePageClick(1)}
                >
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
                    current={page === i}
                    onClick={() => handlePageClick(i)}
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
                    current={page === totalPages}
                    onClick={() => handlePageClick(totalPages)}
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
                    onChange={handleSearchChange}
                    className="my-4 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 min-w-80"
                />
                {/* Sorting Dropdown */}
                <Dropdown>
                    <DropdownButton outline color="cyan">
                        Sort by <ChevronDownIcon />
                    </DropdownButton>
                    <DropdownMenu>
                        <DropdownItem onClick={() => handleSortChange("name")}>
                            Name{" "}
                            {sortBy === "name" && `(Sorted: ${sortDirection})`}
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => handleSortChange("lead_status_id")}
                        >
                            Deal Status{" "}
                            {sortBy === "lead_status_id" &&
                                `(Sorted: ${sortDirection})`}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                {/* Status Filtering Dropdown -- Still need to fix */}
                <Dropdown>
                    <DropdownButton outline color="cyan">
                        Filter by Status <ChevronDownIcon />
                    </DropdownButton>
                    <DropdownMenu>
                        <DropdownItem onClick={() => handleStatusFilter(null)}>
                            All
                        </DropdownItem>
                        {statuses.map((status) => (
                            <DropdownItem
                                key={status.id}
                                onClick={() => handleStatusFilter(status.id)}
                            >
                                {status.name}
                                {selectedStatus === status.id && " (Selected)"}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
                <Button color="blue" onClick={() => openModal()}>
                    Add New Lead
                </Button>
            </div>
            {notification && (
                <div className="bg-green-500 text-white p-2 mb-4 rounded">
                    {notification}
                </div>
            )}
            {loading ? (
                <Spinner />
            ) : (
                <LeadsTable
                    leads={leads}
                    openModal={openModal}
                    handleDeleteLead={handleDeleteLead}
                />
            )}

            <LeadsTable
                leads={leads}
                openModal={openModal}
                handleDeleteLead={handleDeleteLead}
            />
            <Pagination className="mt-6">
                <PaginationPrevious
                    onClick={() => {
                        if (page > 1) setPage(page - 1);
                    }}
                >
                    Previous
                </PaginationPrevious>
                <PaginationList>{renderPageNumbers()}</PaginationList>
                <PaginationNext
                    onClick={() => {
                        if (page < totalPages) setPage(page + 1);
                    }}
                >
                    Next
                </PaginationNext>
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
