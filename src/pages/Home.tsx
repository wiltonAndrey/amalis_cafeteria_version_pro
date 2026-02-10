import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import LocationSection from '../components/sections/LocationSection';
import PromotionsSection from '../components/sections/PromotionsSection';
import CoffeeExperience from '../components/sections/CoffeeExperience';

const Home: React.FC = () => {
    return (
        <>
            <section id="home" className="snap-section"><Hero /></section>
            <section id="about" className="py-20 snap-section"><WhyChooseUs /></section>
            <section id="featured" className="py-20 bg-transparent snap-section"><FeaturedProducts /></section>
            <section id="contact" className="snap-section"><PromotionsSection /></section>
            <section id="experience" className="snap-section"><CoffeeExperience /></section>
            <section id="gallery" className="py-20 bg-transparent snap-section"><Gallery /></section>
            <section id="testimonials" className="py-20 snap-section"><Testimonials /></section>
            <section id="location" className="py-20 bg-transparent snap-section"><LocationSection /></section>
        </>
    );
};

export default Home;
