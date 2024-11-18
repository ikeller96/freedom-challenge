import React, { useState, useEffect } from "react";
import { Fieldset, FieldGroup, Field, Label, Legend } from "./catalyst/fieldset";
import { Input } from "./catalyst/input";
import { Select } from "./catalyst/select";
import { Button } from "./catalyst/button";

interface LeadFormModalProps {
  lead?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    lead_status_id: number;
  };
  statuses: { id: number; name: string }[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    lead_status_id: number;
  }) => void;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ lead, statuses, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    lead_status_id: statuses.length > 0 ? statuses[0].id : 0,
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        lead_status_id: lead.lead_status_id,
      });
    }
  }, [lead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <Fieldset>
            <Legend>{lead ? "Edit Lead" : "Add New Lead"}</Legend>
            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter lead's name"
                  required
                />
              </Field>
              <Field>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter lead's email"
                  required
                />
              </Field>
              <Field>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter lead's phone number"
                  required
                />
              </Field>
              <Field>
                <Label>Status</Label>
                <Select
                  name="lead_status_id"
                  value={formData.lead_status_id}
                  onChange={handleChange}
                  required
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </FieldGroup>
          </Fieldset>
          <div className="flex justify-end mt-4 gap-2">
            <Button type="button" onClick={onClose} color="zinc">
              Cancel
            </Button>
            <Button type="submit" color="blue">{lead ? "Save Changes" : "Create Lead"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;