import {isSameDay, parseISO} from "date-fns";

export function sortEventData(data, searchText, searchTags) {
  const selectedTags = searchTags.filter(tag => tag.value).map(tag => tag.name.toLowerCase());

  const filteredEvents = data.filter((event) => {
    // Filtration by name of the event
    const nameMatches = event.name.toLowerCase().replace(/\s/g, '')
      .includes(searchText.toLowerCase().replace(/\s/g, ''));

    // Filtration by tags
    const tagsMatch = selectedTags.length === 0 || selectedTags.includes(event.event_type.name.toLowerCase());

    return nameMatches && tagsMatch;
  });

  // Sorting by data
  filteredEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  return filteredEvents;
}
