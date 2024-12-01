import React, { useState, useEffect } from "react";
import axios from "axios";

function Footer() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-6">
            <footer className="footer">
                <div className="container mt-5">
                    <div className="p-4 mt-2">
                    <div className="grid grid-cols-1 gap-4">
    <div className="col-span-1 mb-3">
        <div className="flex flex-col md:flex-row">
            <span className="text-gray-600 font-semibold mr-2">
                DISCOVER:
            </span>
            <span className="text-gray-500 text-md">
                Nail Art, Eye Makeup, Bridal Makeup, How To Do Makeup, Pimples, Stretchmark Removal, Best Eye Creams, Hairstyles, Burgundy Hair Colors.
            </span>
        </div>
    </div>
    <div className="col-span-1 mb-3">
        <div className="flex flex-col md:flex-row">
            <span className="text-gray-600 font-semibold mr-2">
                SHOP MAKEUP:
            </span>
            <span className="text-gray-500 text-md">
                Lakme, Maybelline, Colorbar, L'oreal, Revlon, Avon, Elle18
            </span>
        </div>
    </div>
    <div className="col-span-1 mb-3">
        <div className="flex flex-col md:flex-row">
            <span className="text-gray-600 font-semibold mr-2">
                SKIN CARE:
            </span>
            <span className="text-gray-500 text-md">
                Bio Oil, Olay, Neutrogena, Lotus Herbals, VLCC, Kaya, Vichy, Nivea, Gillette, Park Avenue
            </span>
        </div>
    </div>
    <div className="col-span-1 mb-3">
        <div className="flex flex-col md:flex-row">
            <span className="text-gray-600 font-semibold mr-2">
                HAIR PRODUCTS:
            </span>
            <span className="text-gray-500 text-md">
                L'oreal Professionnel, Schwarzkopf, Matrix Biolage, Livon Hair Gain, Biotique, Roots
            </span>
        </div>
    </div>
    <div className="col-span-1 mb-3">
        <div className="flex flex-col md:flex-row">
            <span className="text-gray-600 font-semibold mr-2">
                FRAGRANCE:
            </span>
            <span className="text-gray-500 text-sm">
                Davidoff, Hugo Boss, Calvin Klein, Elizabeth Arden, Jaguar, Victoria's Secret
            </span>
        </div>
    </div>
    <div className="col-span-1">
        <div className="flex flex-col md:flex-row">
            <span className="text-gray-600 font-semibold mr-2">
                ELECTRONICS:
            </span>
            <span className="text-gray-500 text-md">
                Philips, Wahl, Braun, Remington
            </span>
        </div>
    </div>
</div>
                    </div>
                </div>
                <div className="bg-white py-4 mt-4">
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3  gap-3 ms-2">
        <div className="col-span-1 mb-4">
            <h5 className="font-bold text-gray-600 mb-3">Purplle</h5>
            <ul className="list-none text-gray-500">
                <li>About Us</li>
                <li>Our Team</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Sitemap</li>
                <li>Compliance</li>
            </ul>
        </div>
        <div className="col-span-1 mb-4">
            <h5 className="font-bold text-gray-600 mb-3">Privacy Info</h5>
            <ul className="list-none text-gray-500">
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
                <li>Return & Cancellation Policy</li>
            </ul>
        </div>
        <div className="col-span-1 mb-4">
            <h5 className="font-bold text-gray-600 mb-3">Need Help?</h5>
            <ul className="list-none text-gray-500">
                <li>FAQ's</li>
                <li>Contact Us</li>
            </ul>
        </div>
    </div>
</div>

                <div className="container flex flex-col sm:flex-row justify-between py-4 ms-2">
                    <div className="payment-section flex flex-wrap items-center space-x-4 mb-4 sm:mb-0">
                        <span className="font-semibold text-gray-600 mr-4">Payment</span>
                        <img
                            src="https://storage.googleapis.com/a1aa/image/1kna43PSq9LDCpexBFZvo6kogf474eLmqBwCorGS5e4u8PJPB.jpg"
                            alt="Visa logo"
                            className="w-5 h-auto mb-2 sm:mb-0"
                        />
                        <img
                            src="https://storage.googleapis.com/a1aa/image/ohxlCD6RNS4pF9xyOcnBn5nodoq7MnbadS7kFe2UDYHkfTyTA.jpg"
                            alt="MasterCard logo"
                            className="w-5 h-auto mb-2 sm:mb-0"
                        />
                        <img
                            src="https://storage.googleapis.com/a1aa/image/RpnDOstGETpdJNsJemrdgrJ2bIatMJaDvmlMXlFVfs4GfnknA.jpg"
                            alt="Maestro logo"
                            className="w-5 h-auto mb-2 sm:mb-0"
                        />
                        <img
                            src="https://storage.googleapis.com/a1aa/image/T9LZ5Qk9exyYa6czI9XyDbCy57YnGFynHPxkfbO8gvuNfnknA.jpg"
                            alt="American Express logo"
                            className="w-5 h-auto mb-2 sm:mb-0"
                        />
                        <img
                            src="https://storage.googleapis.com/a1aa/image/8kgeZ4SD7l0sd6JdgRSn8YflYd1osYQgTNQ8kuftQ0bUePJPB.jpg"
                            alt="Net Banking logo"
                            className="w-5 h-auto mb-2 sm:mb-0"
                        />
                        <img
                            src="https://storage.googleapis.com/a1aa/image/ew0Wu5MRDxWDFScDRyzw7pfXHriuhXGA1Ufe6lS6ckTm8PJPB.jpg"
                            alt="Cash on Delivery logo"
                            className="w-5 h-auto mb-2 sm:mb-0"
                        />
                    </div>

                    <div className="connect-section flex flex-wrap items-center space-x-4">
                        <span className="font-semibold text-gray-600 mr-4">Connect</span>
                        <a href="#" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
                            <i className="fab fa-facebook-f" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
                            <i className="fab fa-twitter" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
                            <i className="fab fa-google-plus-g" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
                            <i className="fab fa-pinterest" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
                            <i className="fas fa-envelope" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
                            <i className="fab fa-youtube" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
                            <i className="fab fa-instagram" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
                            <i className="fab fa-linkedin" />
                        </a>
                    </div>
                </div>

                <div className="container text-center py-4">
                    <span className="text-gray-500">
                        Copyright © 2020 Purplle. All Rights Reserved.
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
