import React from 'react'
import { FacebookLogo, TwitterLogo, LinkedinLogo, YoutubeLogo, InstagramLogo, ArrowRight } from "phosphor-react"

function FooterTwo() {
    return (
        <div>
            <>
                {/* rts footer area start */}
                <div className="rts-footer-area-two">
                    <div className="container-2">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="footer-two-main-wrapper">
                                    <div className="footer-single-wixed-two start">
                                        <a href="/" className="logo-area">
                                            <img
                                                src="/images/matcha.png"
                                                alt="logo-umkm"
                                                className="logo"
                                                onError={(e) => {
                                                    // Fallback to a text logo if image fails
                                                    e.currentTarget.style.display = 'none';
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        const textSpan = document.createElement('span');
                                                        textSpan.className = 'text-xl font-bold text-white';
                                                        textSpan.textContent = 'UMKM Indonesia';
                                                        parent.appendChild(textSpan);
                                                    }
                                                }}
                                            />
                                        </a>
                                        <p className="disc">
                                            Temukan dan dukung UMKM lokal terbaik di Indonesia
                                        </p>
                                        <form action="#" className="newsletter-form">
                                            <input type="email" placeholder="Alamat Email"/>
                                            <button className="rts-btn btn-primary">
                                                <ArrowRight size={14} weight="bold" />
                                            </button>
                                        </form>
                                        <div className="social-style-dash">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <FacebookLogo size={16} weight="bold" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <TwitterLogo size={16} weight="bold" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <LinkedinLogo size={16} weight="bold" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <YoutubeLogo size={16} weight="bold" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <InstagramLogo size={16} weight="bold" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="single-footer-wized mid">
                                        <h3 className="footer-title">Informasi UMKM</h3>
                                        <div className="footer-nav">
                                            <ul>
                                                <li>
                                                    <a href="/about">Tentang Kami</a>
                                                </li>
                                                <li>
                                                    <a href="/faq">FAQ</a>
                                                </li>
                                                <li>
                                                    <a href="/terms-condition">Syarat & Ketentuan</a>
                                                </li>
                                                <li>
                                                    <a href="/privacy-policy">Kebijakan Privasi</a>
                                                </li>
                                                <li>
                                                    <a href="/contact">Kontak</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="single-footer-wized mid">
                                        <h3 className="footer-title">Kategori UMKM</h3>
                                        <div className="footer-nav">
                                            <ul>
                                                <li>
                                                    <a href="/umkm?category=kuliner">Kuliner</a>
                                                </li>
                                                <li>
                                                    <a href="/umkm?category=fashion">Fashion</a>
                                                </li>
                                                <li>
                                                    <a href="/umkm?category=kerajinan">Kerajinan</a>
                                                </li>
                                                <li>
                                                    <a href="/umkm?category=retail">Retail</a>
                                                </li>
                                                <li>
                                                    <a href="/umkm?category=teknologi">Teknologi</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="single-footer-wized">
                                        <h3 className="footer-title">Butuh Bantuan? / Kontak Kami</h3>
                                        <div className="contact-information">
                                            {/* single contact information */}
                                            <div className="single-contact-information-area">
                                                <div className="icon-area">
                                                    <img src="assets/images/icons/11.svg" alt="icons" />
                                                </div>
                                                <div className="information-area">
                                                    <p className="disc">
                                                        Jl. UMKM No. 1, Jakarta <br />
                                                        Indonesia
                                                    </p>
                                                </div>
                                            </div>
                                            {/* single contact information emd */}
                                            {/* single contact information */}
                                            <div className="single-contact-information-area">
                                                <div className="icon-area">
                                                    <img src="assets/images/icons/12.svg" alt="icons" />
                                                </div>
                                                <div className="information-area">
                                                    <p className="disc">
                                                        Buka 24 Jam <br />
                                                        <a href="tel:+622112345678">+62 21 1234 5678</a>
                                                    </p>
                                                </div>
                                            </div>
                                            {/* single contact information emd */}
                                            {/* single contact information */}
                                            <div className="single-contact-information-area">
                                                <div className="icon-area">
                                                    <img src="assets/images/icons/13.svg" alt="icons" />
                                                </div>
                                                <div className="information-area">
                                                    <p className="disc">
                                                        Live Chat <br />
                                                        <span>Chat Dengan Ahli</span>
                                                    </p>
                                                </div>
                                            </div>
                                            {/* single contact information emd */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts footer area end */}
                {/* rts copyright area start */}
                <div className="rts-copyright-area-two">
                    <div className="container-2">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="copyright-arae-two-wrapper">
                                    <p className="disc">
                                        Copyright 2025 <a href="#">©UMKM Indonesia</a>. All rights reserved.
                                    </p>
                                    <div className="payment-processw-area">
                                        <span>Metode Pembayaran:</span>
                                        <img src="assets/images/payment/04.png" alt="payment" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts copyright area end */}
            </>

        </div>
    )
}

export default FooterTwo