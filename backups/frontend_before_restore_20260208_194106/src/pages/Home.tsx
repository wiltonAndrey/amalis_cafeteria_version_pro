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
            <section id="home"><Hero /></section>
            <section id="about" className="py-20"><WhyChooseUs /></section>
            <section id="featured" className="py-20 bg-transparent"><FeaturedProducts /></section>
            <section id="contact"><PromotionsSection /></section>
            <section id="experience"><CoffeeExperience /></section>
            <section id="gallery" className="py-20 bg-transparent"><Gallery /></section>
            <section id="testimonials" className="py-20"><Testimonials /></section>
            <section id="location" className="py-20 bg-transparent"><LocationSection /></section>
        </>
    );
};

export default Home;
