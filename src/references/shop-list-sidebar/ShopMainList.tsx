"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from "@/components/header/CartContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



interface BlogGridMainProps {
  Slug: string;
  ProductImage: string;
  ProductTitle?: string;
  Price?: string;
}

const BlogGridMain: React.FC<BlogGridMainProps> = ({
  Slug,
  ProductImage,
  ProductTitle,
  Price,
}) => {


  type ModalType = 'one' | 'two' | 'three' | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);



  // number count up and down
  useEffect(() => {
    const handleQuantityClick = (e: Event) => {
      const button = e.currentTarget as HTMLElement;
      const parent = button.closest('.quantity-edit') as HTMLElement | null;
      if (!parent) return;

      const input = parent.querySelector('.input') as HTMLInputElement | null;
      const addToCart = parent.querySelector('a.add-to-cart') as HTMLElement | null;
      if (!input) return;

      let oldValue = parseInt(input.value || '1', 10);
      let newVal = oldValue;

      if (button.classList.contains('plus')) {
        newVal = oldValue + 1;
      } else if (button.classList.contains('minus')) {
        newVal = oldValue > 1 ? oldValue - 1 : 1;
      }

      input.value = newVal.toString();
      if (addToCart) {
        addToCart.setAttribute('data-quantity', newVal.toString());
      }
    };

    const buttons = document.querySelectorAll('.quantity-edit .button');

    // 💡 Remove any existing handlers first (safe rebind)
    buttons.forEach(button => {
      button.removeEventListener('click', handleQuantityClick);
      button.addEventListener('click', handleQuantityClick);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleQuantityClick);
      });
    };
  }, []);





  // cart item
  const { addToCart } = useCart(); // Now works

  const handleAdd = () => {
    addToCart({
      id: Date.now(), // unique ID
      image: `/assets/images/grocery/${ProductImage}`,
      title: ProductTitle ?? 'Default Product Title',
      price: parseFloat(Price ?? '0'),
      quantity: 1,
      active: true,
    });
  };
  const addcart = () => toast('Successfully Add To Cart !');

  return (
    <>

      <div className="single-shopping-card-one discount-offer">
        <a href={`/shop/${Slug}`} className="thumbnail-preview">
          <div className="badge">
            <span>
              25% <br />
              Off
            </span>
            <i className="fa-solid fa-bookmark" />
          </div>
          <img src={`/assets/images/grocery/${ProductImage}`} alt="grocery" />
        </a>
        <div className="body-content">
          <div className="title-area-left">
            <a href={`/shop/${Slug}`}>
              <h4 className="title">
                {ProductTitle ? ProductTitle : 'How to growing your business'}
              </h4>
            </a>
            <span className="availability">500g Pack</span>
            <div className="price-area">
              <span className="current">{`$${Price}`}</span>
              <div className="previous">$36.00</div>
            </div>
            <div className="cart-counter-action">
              <div className="quantity-edit">
                <input type="text" className="input" defaultValue={1} />
                <div className="button-wrapper-action">
                  <button className="button minus">
                    <i className="fa-regular fa-chevron-down" />
                  </button>
                  <button className="button plus">
                    +<i className="fa-regular fa-chevron-up" />
                  </button>
                </div>
              </div>
              <a href="#" className="rts-btn btn-primary radious-sm with-icon" onClick={e => {
                e.preventDefault();
                handleAdd();
                addcart();
              }}>
                <div className="btn-text">Add To Cart</div>
                <div className="arrow-icon">
                  <i className="fa-regular fa-cart-shopping" />
                </div>
                <div className="arrow-icon">
                  <i className="fa-regular fa-cart-shopping" />
                </div>
              </a>
            </div>
          </div>
          <div className="natural-value">
            <h6 className="title">Nutritional Values</h6>
            <div className="single">
              <span>Energy(kcal):</span>
              <span>211</span>
            </div>
            <div className="single">
              <span>Protein(g):</span>
              <span>211</span>
            </div>
            <div className="single">
              <span>magnetiam(kcal):</span>
              <span>211</span>
            </div>
            <div className="single">
              <span>Calory(kcal):</span>
              <span>211</span>
            </div>
            <div className="single">
              <span>Vitamine(kcal):</span>
              <span>211</span>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default BlogGridMain;
