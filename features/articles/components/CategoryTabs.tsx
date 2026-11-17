export default function CategoryTabs({ 
    categories, 
    selectedCategory, 
    onCategoryChange 
}: { 
    categories: string[]; 
    selectedCategory: string; 
    onCategoryChange: (category: string) => void 
}) {
    return (
        <div className="category-tabs">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
