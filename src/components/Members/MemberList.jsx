import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import MemberForm from './MemberForm';
import { memberAPI } from './MemberAPI';

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await memberAPI.getAll();
      setMembers(data);
    } catch (error) {
      alert('Error fetching members: ' + error.message);
    }
    setLoading(false);
  };

  const handleCreate = async (formData) => {
    try {
      await memberAPI.create(formData);
      alert('Member created successfully!');
      setShowForm(false);
      fetchMembers();
    } catch (error) {
      alert('Error creating member: ' + error.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await memberAPI.update(editingMember.memberId, formData);
      alert('Member updated successfully!');
      setEditingMember(null);
      setShowForm(false);
      fetchMembers();
    } catch (error) {
      alert('Error updating member: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await memberAPI.delete(id);
        alert('Member deleted successfully!');
        fetchMembers();
      } catch (error) {
        alert('Error deleting member: ' + error.message);
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  return (
    <div>
      {!showForm && (
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus size={20} /> Add Member
          </button>
        </div>
      )}

      {showForm && (
        <MemberForm
          onSubmit={editingMember ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
          editingMember={editingMember}
        />
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.memberId} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{member.memberId}</td>
                    <td className="px-6 py-4">{member.name}</td>
                    <td className="px-6 py-4">{member.email}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.memberId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}