import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Coupon.css";
import axios from "axios";

const Coupon = () => {
  const { url } = useContext(StoreContext);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await axios.get(`${url}/api/promo/all`);
        if (response.data.success) {
          // Filter only active promos
          const activePromos = response.data.data.filter(
            (promo) => promo.isActive,
          );
          setPromos(activePromos);
        }
      } catch (error) {
        console.error("Error fetching promos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, [url]);

  if (loading) {
    return null;
  }

  if (promos.length === 0) {
    return null;
  }

  return (
    <div className="Coupon" id="coupon">
      <h2>Available Offers</h2>
      <p className="Coupon-description">
        Check out our latest discounts and deals!
      </p>
      <div className="Coupon-grid">
        {promos.map((promo, index) => (
          <div key={index} className="coupon-card">
            <div className="coupon-card-header">
              <span className="coupon-code">{promo.promoCode}</span>
            </div>
            <div className="coupon-card-body">
              <span className="coupon-discount">
                {promo.discountType === "percentage"
                  ? `${promo.discount}% OFF`
                  : `₹${promo.discount} OFF`}
              </span>
              <span className="coupon-expiry">
                Valid until: {new Date(promo.expiryDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coupon;
