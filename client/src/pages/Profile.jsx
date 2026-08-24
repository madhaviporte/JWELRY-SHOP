import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMapPin, FiLock, FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [addressForm, setAddressForm] = useState({
    fullName: "", phone: "", address: "", city: "", state: "", postalCode: "", country: "India",
  });
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setProfile(res.data.user);
        setProfileForm({
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone || "",
        });
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users/profile", profileForm);
      setProfile(res.data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await api.put("/users/change-password", passwordForm);
      toast.success("Password changed");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = editingAddress
        ? await api.put(`/users/addresses/${editingAddress}`, addressForm)
        : await api.post("/users/addresses", addressForm);
      setProfile((p) => ({ ...p, address: res.data.addresses }));
      toast.success(editingAddress ? "Address updated" : "Address added");
      setAddressForm({ fullName: "", phone: "", address: "", city: "", state: "", postalCode: "", country: "India" });
      setEditingAddress(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await api.delete(`/users/addresses/${id}`);
      setProfile((p) => ({ ...p, address: res.data.addresses }));
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const startEditAddress = (addr) => {
    setEditingAddress(addr._id);
    setAddressForm({
      fullName: addr.fullName, phone: addr.phone, address: addr.address,
      city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country,
    });
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-avatar">
              {user.avatar ? <img src={user.avatar} alt={user.name} /> : <FiUser size={32} />}
            </div>
            <h3>{profile?.name}</h3>
            <p>{profile?.email}</p>
            <nav className="profile-nav">
              <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}><FiUser /> Profile</button>
              <button className={activeTab === "addresses" ? "active" : ""} onClick={() => setActiveTab("addresses")}><FiMapPin /> Addresses</button>
              <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}><FiLock /> Password</button>
            </nav>
          </aside>

          <div className="profile-main">
            {activeTab === "profile" && (
              <div className="profile-section">
                <h2>My Profile</h2>
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input className="form-input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-input" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input className="form-input" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="profile-section">
                <h2>My Addresses</h2>
                {profile?.address?.length > 0 && (
                  <div className="address-list">
                    {profile.address.map((addr) => (
                      <div key={addr._id} className="address-card">
                        <div className="address-card__content">
                          <strong>{addr.fullName}</strong> {addr.isDefault && <span className="badge badge-accent">Default</span>}
                          <p>{addr.address}</p>
                          <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                          <p>{addr.country}</p>
                          <p>Phone: {addr.phone}</p>
                        </div>
                        <div className="address-card__actions">
                          <button onClick={() => startEditAddress(addr)}><FiEdit2 size={14} /></button>
                          <button onClick={() => handleDeleteAddress(addr._id)}><FiTrash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={handleAddAddress} className="address-form">
                  <h4>{editingAddress ? "Edit Address" : "Add New Address"}</h4>
                  <div className="form-row">
                    <div className="form-group"><label>Full Name</label><input className="form-input" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} required /></div>
                    <div className="form-group"><label>Phone</label><input className="form-input" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} required /></div>
                  </div>
                  <div className="form-group"><label>Address</label><input className="form-input" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} required /></div>
                  <div className="form-row">
                    <div className="form-group"><label>City</label><input className="form-input" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required /></div>
                    <div className="form-group"><label>State</label><input className="form-input" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} required /></div>
                    <div className="form-group"><label>Postal Code</label><input className="form-input" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} required /></div>
                  </div>
                  <div className="form-group"><label>Country</label><input className="form-input" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} /></div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button type="submit" className="btn btn-primary btn-sm">{editingAddress ? "Update" : "Add"} Address</button>
                    {editingAddress && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditingAddress(null); setAddressForm({ fullName: "", phone: "", address: "", city: "", state: "", postalCode: "", country: "India" }); }}>Cancel</button>}
                  </div>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="profile-section">
                <h2>Change Password</h2>
                <form onSubmit={handleChangePassword}>
                  <div className="form-group"><label>Current Password</label><input type="password" className="form-input" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required /></div>
                  <div className="form-group"><label>New Password</label><input type="password" className="form-input" placeholder="Min. 6 characters" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required /></div>
                  <button type="submit" className="btn btn-primary">Change Password</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
