import { motion } from "framer-motion";
import { Coffee, Heart, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[hsl(25_40%_15%)] text-[hsl(35_40%_92%)] py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                                <Coffee className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-display text-xl font-semibold">Brew & Co.</span>
                        </div>
                        <p className="text-[hsl(35_40%_92%)] max-w-sm">
                            Crafting perfect moments, one cup at a time. Visit us for artisan coffee and freshly baked treats.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-[hsl(35_40%_92%)]">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#menu" className="text-[hsl(35_40%_92%)] hover:text-[hsl(30_70%_50%)] transition-colors">Our Menu</a></li>
                            <li><a href="#booking" className="text-[hsl(35_40%_92%)] hover:text-[hsl(30_70%_50%)] transition-colors">Book a Table</a></li>
                            <li><a href="#location" className="text-[hsl(35_40%_92%)] hover:text-[hsl(30_70%_50%)] transition-colors">Visit Us</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-semibold mb-4 text-[hsl(35_40%_92%)]">Follow Us</h4>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center hover:bg-orange-700 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center hover:bg-orange-700 transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center hover:bg-orange-700 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-[hsl(30_40%_92%)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[hsl(35_40%_92%)] text-sm">
                        © {new Date().getFullYear()} Brew & Co. All rights reserved.
                    </p>
                    <p className="text-[hsl(35_40%_92%)] text-sm flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-terracotta" /> for coffee lovers
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
