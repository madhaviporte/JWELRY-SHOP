import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCreditCard, FiPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../services/api";
import "./Checkout.css";

const emptyAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ ...emptyAddress });
  const [addressSaving, setAddressSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartRes, profileRes] = await Promise.all([
          api.get("/cart"),
          api.get("/users/profile"),
        ]);
        setCart(cartRes.data.cart);
        const addrs = profileRes.data.user?.address || [];
        setAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr._id);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ---------- address helpers ----------

  const validateAddress = (addr) => {
    if (!addr.fullName?.trim()) return "Full name is required";
    if (!addr.phone?.trim()) return "Phone number is required";
    if (!addr.address?.trim()) return "Address line is required";
    if (!addr.city?.trim()) return "City is required";
    if (!addr.state?.trim()) return "State is required";
    if (!addr.postalCode?.trim()) return "Postal code is required";
    return null;
  };

  const handleSaveAddress = async () => {
    const error = validateAddress(addressForm);
    if (error) {
      toast.error(error);
      return null;
    }
    setAddressSaving(true);
    try {
      const res = await api.post("/users/addresses", {
        fullName: addressForm.fullName.trim(),
        phone: addressForm.phone.trim(),
        address: addressForm.address.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        postalCode: addressForm.postalCode.trim(),
        country: addressForm.country.trim() || "India",
        isDefault: addresses.length === 0,
      });
      const savedAddresses = res.data.addresses;
      setAddresses(savedAddresses);
      const newAddr = savedAddresses[savedAddresses.length - 1];
      setSelectedAddress(newAddr._id);
      setShowAddressForm(false);
      setAddressForm({ ...emptyAddress });
      toast.success("Address saved");
      return newAddr;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
      return null;
    } finally {
      setAddressSaving(false);
    }
  };

  // ---------- payment ----------

  const handlePayment = async () => {
    // 1. Ensure an address is selected
    if (!selectedAddress) {
      toast.error("Please select or add a shipping address");
      return;
    }

    setProcessing(true);
    try {
      // 2. Find the selected address object
      const addr = addresses.find((a) => a._id === selectedAddress);
      if (!addr) {
        toast.error("Selected address not found");
        setProcessing(false);
        return;
      }

      // 3. Validate address before proceeding
      const validationError = validateAddress(addr);
      if (validationError) {
        toast.error(validationError);
        setProcessing(false);
        return;
      }

      // 4. Create Razorpay order (backend)
      const payRes = await api.post("/payment/create-order", {
        amount: cart.totalPrice,
      });
      const { order, keyId } = payRes.data;

      // 5. Open Razorpay Checkout
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Lumière Jewellery",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 6. Verify payment on backend
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes.data.success) {
              toast.error("Payment verification failed");
              setProcessing(false);
              return;
            }

            // 7. Create order (with verified payment details)
            const orderRes = await api.post("/orders", {
              shippingAddress: {
                fullName: addr.fullName,
                phone: addr.phone,
                address: addr.address,
                city: addr.city,
                state: addr.state,
                postalCode: addr.postalCode,
                country: addr.country,
              },
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            });

            toast.success("Order placed successfully!");
            navigate("/order-success", {
              state: { orderId: orderRes.data.order._id },
            });
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Order creation failed"
            );
            setProcessing(false);
          }
        },
        prefill: {
          name: addr.fullName || user.name || "",
          email: user.email || "",
          contact: addr.phone || "",
        },
        theme: { color: "#b8964e" },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        toast.error(
          response.error?.description || "Payment failed. Please try again."
        );
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Payment initialization failed"
      );
      setProcessing(false);
    }
  };

  // ---------- render ----------

  if (loading)
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    );

  if (!cart || cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  const shipping = cart.totalPrice >= 999 ? 0 : 99;
  const tax = Math.round(cart.totalPrice * 0.03 * 100) / 100;
  const total = Math.round((cart.totalPrice + shipping + tax) * 100) / 100;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
        </div>
        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Address Section */}
            <div className="checkout-section">
              <div className="checkout-section__header">
                <h3>
                  <FiMapPin /> Shipping Address
                </h3>
                {!showAddressForm && (
                  <button
                    className="btn btn-sm btn-outline-accent"
                    onClick={() => setShowAddressForm(true)}
                  >
                    <FiPlus /> Add New
                  </button>
                )}
              </div>

              {/* Existing addresses */}
              {addresses.length > 0 && !showAddressForm && (
                <div className="checkout-addresses">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`checkout-address ${
                        selectedAddress === addr._id ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                      />
                      <div>
                        <strong>{addr.fullName}</strong>
                        <p>
                          {addr.address}, {addr.city}, {addr.state}{" "}
                          {addr.postalCode}
                        </p>
                        <p>Phone: {addr.phone}</p>
                        {addr.isDefault && (
                          <span className="badge badge--accent">Default</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Inline address form */}
              {showAddressForm && (
                <div className="checkout-address-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        className="form-input"
                        placeholder="Full name"
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      className="form-input"
                      placeholder="Street address, apartment, suite, etc."
                      value={addressForm.address}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        className="form-input"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        className="form-input"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            state: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Postal Code *</label>
                      <input
                        className="form-input"
                        placeholder="400001"
                        value={addressForm.postalCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        className="form-input"
                        placeholder="India"
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            country: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="checkout-address-form__actions">
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveAddress}
                      disabled={addressSaving}
                    >
                      {addressSaving ? "Saving..." : "Save Address"}
                    </button>
                    {addresses.length > 0 && (
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setShowAddressForm(false);
                          setAddressForm({ ...emptyAddress });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* No addresses at all */}
              {addresses.length === 0 && !showAddressForm && (
                <div className="checkout-empty-address">
                  <p>No shipping address found.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowAddressForm(true)}
                  >
                    <FiPlus /> Add Address
                  </button>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="checkout-section">
              <h3>Order Items</h3>
              <div className="checkout-items">
                {cart.items.map((item) => (
                  <div key={item._id} className="checkout-item">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                    />
                    <div>
                      <strong>{item.name}</strong>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span>
                      ₹
                      {(
                        (item.discountPrice > 0 &&
                        item.discountPrice < item.price
                          ? item.discountPrice
                          : item.price) * item.quantity
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <span>₹{cart.totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Tax (GST)</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <button
              className="btn btn-accent btn-lg"
              style={{ width: "100%", marginTop: 20 }}
              onClick={handlePayment}
              disabled={
                processing || !selectedAddress || showAddressForm || addressSaving
              }
            >
              <FiCreditCard />{" "}
              {processing ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
            </button>

            {showAddressForm && (
              <p className="checkout-note">
                Save your address first, then click Pay.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
