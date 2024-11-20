import React from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
} from "./catalyst/table";
import {
    Dropdown,
    DropdownButton,
    DropdownItem,
    DropdownMenu,
} from "./catalyst/dropdown";
import { Lead } from "../api/leadService";
import { formatPhoneNumber } from "../utils/helperFunctions";

type LeadsTableProps = {
    leads: Lead[];
    openModal: (lead: Lead) => void;
    handleDeleteLead: (leadId: number) => Promise<void>;
};

const LeadsTable: React.FC<LeadsTableProps> = ({
    leads,
    openModal,
    handleDeleteLead,
}) => {
    return (
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
                            <Dropdown>
                                <DropdownButton color="zinc">Options</DropdownButton>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => openModal(lead)}>
                                        Edit
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => handleDeleteLead(lead.id)}
                                    >
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default LeadsTable;