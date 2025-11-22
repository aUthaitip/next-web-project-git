
export default function CategoryTabs({ categories, selectedCategory, onCategoryChange }) {
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