export const mockCategories = [
  { id: 'all', name: 'All' },
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'lunch', name: 'Lunch' },
  { id: 'dinner', name: 'Dinner' },
  { id: 'dessert', name: 'Dessert' },
];

export const mockRecipes = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    category: 'dinner',
    image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&q=80',
    time: '25m',
    ingredients: ['spaghetti', 'egg', 'cheese', 'bacon', 'pepper'],
    summary: 'Classic Roman pasta with eggs, cheese, and pancetta.',
  },
  {
    id: '2',
    title: 'Avocado Toast',
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
    time: '10m',
    ingredients: ['avocado', 'bread', 'lemon', 'salt', 'pepper'],
    summary: 'Crispy toast topped with creamy mashed avocado.',
  },
  {
    id: '3',
    title: 'Chicken Salad',
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    time: '20m',
    ingredients: ['chicken', 'lettuce', 'tomato', 'cucumber', 'dressing'],
    summary: 'Fresh and light salad with grilled chicken.',
  },
];

export const mockNotes = {
  '1': ['Use guanciale if available', 'Add extra pepper for heat'],
};
