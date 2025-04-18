import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Activity,
  Coffee,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import { eventData } from '../data/event';
import EditEvent from './EditEvent';


const MyOrganizerEvents = ({ organizerId }) => {
  // State to manage the active category and currently viewed event
  const [activeCategory, setActiveCategory] = useState("menu");
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Filter events by organizer ID
  const organizerEvents = eventData.filter(event => 
    event.organizer.id === organizerId
  ).map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    organizer: event.organizer,
    likes: event.likes,
    description: event.description,
    image: event.coverImage,
    type: event.type,
    profile: event.organizer.src,
    categories: event.categories,
    capacity: event.capacity
  }));

  

  // If no events are found for the given organizer id, display an error message
  if (!organizerEvents.length) {
    return <div className="text-center mt-20">No events found for this organizer.</div>;
  }

  // Get the current event for navigation
  const currentEvent = organizerEvents[activeEventIndex];

  const initialData = {
    id: currentEvent.id,
    title: currentEvent.title,
    description: currentEvent.description,
    date: currentEvent.date, // Would need to be formatted as YYYY-MM-DD for the date input
    time: "18:00", // This would need to be extracted from the event data if available
    location: "Event Location", // This would need to be extracted from event data if available
    coverImage: currentEvent.image,
    capacity: currentEvent.capacity,
    personalities: {
      performers: currentEvent.categories.personalities?.sections.performers || [],
      guests: currentEvent.categories.personalities?.sections.guests || [],
      speakers: currentEvent.categories.personalities?.sections.speakers || []
    },
    requirements: currentEvent.categories.requirements?.items.map(item => item.name).join('\n') || "",
    activities: currentEvent.categories.activities?.items.map(item => item.name).join('\n') || "",
    food: currentEvent.categories.food?.items || [],
    drinks: currentEvent.categories.drinks?.items || []
  };

  // Toggle menu for a specific event
  const toggleMenu = (index) => {
    if (index !== selectedEventIndex) {
      setSelectedEventIndex(index);
      setActiveCategory("menu");
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen((prevState) => !prevState);
    }
  };

  // Function to handle edit button click
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // Function to render the content of the selected category
  const renderCategoryContent = () => {
    // Only proceed if we have a selected event
    if (selectedEventIndex === null) return null;
    
    const selectedEvent = organizerEvents[selectedEventIndex];
    const category = selectedEvent.categories[activeCategory];

    if (activeCategory === "personalities") {
      return (
        <div className="space-y-8 animate-fadeIn">
          {Object.entries(category.sections).map(([sectionName, people]) => (
            <div key={sectionName} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 capitalize pl-2">
                {sectionName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {people.map((person, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-2 sm:p-3 bg-gray-800/50 rounded-xl backdrop-blur-sm 
                               hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-8 h-8 sm:w-12 sm:h-12 rounded-full ring-2 ring-purple-500 p-0.5"
                    />
                    <span className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-200 text-center">
                      {person.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fadeIn">
        {category.items?.map((item, index) => (
          <div
            key={index}
            className="group relative p-3 sm:p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm 
                       hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent 
                          rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <span className="relative text-xs sm:text-sm font-medium text-gray-200">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      <div className="w-full px-2 sm:px-4 md:max-w-2xl md:mx-auto mt-28 mb-8 space-y-6 sm:space-y-8">
        {/* Event List from Organizer */}
        <div className="space-y-6">
          {organizerEvents.map((event, index) => (
            <div key={event.id} className="rounded-lg md:rounded-[30px] overflow-hidden shadow-2xl">
              {/* Event Header */}
              <div
                className="relative h-[266px] md:h-[312px] bg-cover bg-center p-4 sm:p-6 cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
                style={{ backgroundImage: `url(${event.image})` }}
                onClick={() => toggleMenu(index)}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <img
                      src={event.organizer.src}
                      alt={event.organizer.name}
                      className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white/50 p-0.5"
                    />
                    <div>
                      <span className="text-sm sm:text-base text-white font-medium">
                        {event.organizer.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs text-gray-200">Host</span>
                      </div>
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-3xl text-white mt-8 sm:mt-16 font-bold mb-4 sm:mb-7 tracking-tight">
                    {event.title}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-6 text-white mt-2 md:mt-6">
                    <p className="text-sm sm:text-base text-white/90 font-semibold leading-relaxed max-w-xs">
                      Hello, this is to welcome you all to the {event.title}.
                    </p>
                    <div className="flex gap-3 sm:gap-8 items-center">
                      {/* Location Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>

                      {/* Like Icon */}
                      <div className="flex gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                        <p className="text-sm">{event.likes || 56}</p>
                      </div>

                      {/* Share Icon */}
                      <div className="flex justify-end items-center gap-2 sm:gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                        {/*<div className="border-[2px] border-gray-100 px-2 sm:px-4 p-1 rounded-[30px] bg-gray-300 bg-opacity-50">
                          <p className="text-xs sm:text-base">Request</p>
                        </div>*/}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6 px-3 sm:px-4 py-1 sm:py-2 bg-black/30 rounded-full backdrop-blur-sm">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" />
                      <span className="text-white text-xs sm:text-sm font-medium">
                        {event.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section - Only shown when menu is open for this event */}
              {isMenuOpen && selectedEventIndex === index && (
                <div className="p-4 sm:p-6 bg-[#272222] transition-all duration-500 ease-in-out">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const selectedEvent = organizerEvents[selectedEventIndex];
                        const categories = Object.keys(selectedEvent.categories);
                        const currentIndex = categories.indexOf(activeCategory);
                        const prevIndex =
                          currentIndex - 1 < 0
                            ? categories.length - 1
                            : currentIndex - 1;
                        setActiveCategory(categories[prevIndex]);
                      }}
                      className="p-2 hover:bg-gray-800/70 rounded-xl transition-colors duration-300"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </button>

                    <div className="flex items-center gap-2">
                      {organizerEvents[selectedEventIndex].categories[activeCategory].icon}
                      <span className="text-sm sm:text-base text-white font-medium">
                        {organizerEvents[selectedEventIndex].categories[activeCategory].title}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const selectedEvent = organizerEvents[selectedEventIndex];
                        const categories = Object.keys(selectedEvent.categories);
                        const currentIndex = categories.indexOf(activeCategory);
                        const nextIndex = (currentIndex + 1) % categories.length;
                        setActiveCategory(categories[nextIndex]);
                      }}
                      className="p-2 hover:bg-gray-800/70 rounded-xl transition-colors duration-300"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </button>
                  </div>

                  {renderCategoryContent()}

                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs sm:text-sm text-gray-400">
                          Currently Available
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-purple-400">
                        {organizerEvents[selectedEventIndex].capacity}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <button
          onClick={() => setShowEventModal(true)}
          className="absolute bottom-20 right-1/2 lg:right-80 translate-x-8 lg:translate-x-0 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>
      </div>
      <Outlet /> {/* This will render the analytics and edit routes */}
      {showEventModal && <EditEvent 
        onClose={() => setShowEventModal(false)} 
        initialData={organizerEvents[selectedEventIndex]} 
      />}
    </div>
  );
};

export default MyOrganizerEvents;