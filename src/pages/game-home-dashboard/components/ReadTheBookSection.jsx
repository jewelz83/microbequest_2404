import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ReadTheBookSection = ({ className = '' }) => {
  // Mock book data
  const bookData = {
    title: "The Adventures of Aunt Juju and Charlie the Zebra - MICROBIOLOGY EDITION",
    subtitle: "The Complete Story Behind the Game", 
    coverImage: "/assets/images/000_COVER_1-1760837711045.jpg",
    coverAlt: "Book cover showing 'The Adventures of Aunt Juju and Charlie the Zebra - MICROBIOLOGY EDITION' with illustrated African American woman scientist in lab coat holding lab equipment, Charlie the zebra character on her head, laboratory background with scientific equipment, authored by Julianne Tajuba and illustrated by Ingrid Orlando Zon",
    amazonUrl: "https://www.amazon.com/Adventures-Aunt-Juju-Charlie-Zebra/dp/B0D43T9M29",
    websiteUrl: "https://juliannetajuba.com/",
    description: "\"The Adventures of Aunt Juju and Charlie the Zebra: Microbiology Edition\" is an engaging children's book that takes readers on a thrilling journey through the world of microbiology. Throughout the book, the reader learns about the diverse career paths available to microbiologists, including food microbiology, water microbiology, and much more."
  };

  const purchaseOptions = [
    {
      name: "Amazon",
      url: bookData?.amazonUrl,
      icon: "ShoppingCart",
      color: "bg-accent text-accent-foreground",
      description: "Available in print"
    },
    {
      name: "Author\'s Website", 
      url: bookData?.websiteUrl,
      icon: "Globe",
      color: "bg-primary text-primary-foreground",
      description: "Signed copies available"
    }
  ];

  return (
    <section className={`bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 border border-primary/30 rounded-2xl p-6 lg:p-8 ${className}`}>
      {/* Virtual Bookshelf Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-3 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-moderate">
          <Icon name="BookOpen" size={20} className="text-primary" />
          <span className="font-heading text-lg text-foreground">Virtual Bookshelf</span>
          <Icon name="Sparkles" size={16} className="text-accent animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Book Cover & Info */}
        <div className="text-center lg:text-left">
          {/* Book Cover */}
          <div className="relative inline-block mb-6">
            <div className="relative group">
              {/* Book Shadow */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-gray-400/30 to-gray-600/30 rounded-lg blur-sm transform rotate-2" />
              
              {/* Book Cover */}
              <div className="relative bg-gradient-to-br from-primary to-secondary p-6 rounded-lg shadow-pronounced transform transition-transform duration-moderate hover:-rotate-1 hover:scale-105">
                <img
                  src={bookData?.coverImage}
                  alt={bookData?.coverAlt}
                  className="w-48 h-64 mx-auto object-cover rounded border-2 border-white/20 shadow-moderate"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback cover design */}
                <div className="w-48 h-64 mx-auto bg-gradient-to-br from-primary to-secondary rounded border-2 border-white/20 shadow-moderate hidden items-center justify-center">
                  <div className="text-center text-white p-4">
                    <Icon name="BookOpen" size={48} className="mx-auto mb-3 opacity-80" />
                    <h4 className="font-heading text-sm mb-2">{bookData?.title}</h4>
                    <p className="font-caption text-xs opacity-70">By Julianne Tajuba</p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-moderate animate-bounce-gentle">
                <Icon name="Heart" size={16} color="white" />
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-heading text-foreground mb-2">
                {bookData?.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {bookData?.subtitle}
              </p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-4">
              <p className="font-body text-sm text-foreground leading-relaxed">
                {bookData?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action & Purchase Options */}
        <div className="space-y-6">
          {/* Main CTA Message */}
          <div className="text-center bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-moderate">
            <div className="mb-4">
              <Icon name="BookHeart" size={32} className="mx-auto text-primary mb-3" />
              <h4 className="text-lg font-heading text-foreground mb-2">
                Want to read more about Aunt Juju and Charlie?
              </h4>
              <p className="font-body text-sm text-muted-foreground">
                Get the full book with extended adventures, beautiful illustrations, and exciting discoveries!
              </p>
            </div>

            {/* Purchase Options */}
            <div className="space-y-3">
              {purchaseOptions?.map((option) => (
                <a
                  key={option?.name}
                  href={option?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-full"
                >
                  <div className={`
                    flex items-center justify-between p-4 rounded-lg shadow-moderate
                    transition-all duration-fast hover:shadow-pronounced hover:-translate-y-0.5
                    ${option?.color}
                  `}>
                    <div className="flex items-center space-x-3">
                      <Icon name={option?.icon} size={20} strokeWidth={2.5} />
                      <div className="text-left">
                        <span className="font-body font-semibold block">{option?.name}</span>
                        <span className="font-caption text-xs opacity-90">{option?.description}</span>
                      </div>
                    </div>
                    <Icon 
                      name="ExternalLink" 
                      size={16} 
                      className="transition-transform duration-fast group-hover:translate-x-1"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadTheBookSection;