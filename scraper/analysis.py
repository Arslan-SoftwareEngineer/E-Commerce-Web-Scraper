import pandas as pd
import matplotlib.pyplot as plt

def analyze_and_visualize(csv_path="output/products.csv"):
    # Load data
    df = pd.read_csv(csv_path)
    
    # --- Level 5: Exploratory Data Analysis ---
    print(f"Total Products: {len(df)}")
    print(f"Average Price: £{df['price'].mean():.2f}")
    print(f"Min Price: £{df['price'].min():.2f} | Max Price: £{df['price'].max():.2f}")
    print(f"Most Common Rating: {df['rating'].mode()[0]}")
    
    highest_rated = df[df['rating'] == 'Five']
    print(f"Products with 'Five' star rating: {len(highest_rated)}")
    
    # --- Level 6: Visualization ---
    fig, axs = plt.subplots(2, 2, figsize=(12, 10))
    
    # 1. Price Distribution
    axs[0, 0].hist(df['price'], bins=20, color='skyblue', edgecolor='black')
    axs[0, 0].set_title('Product Price Distribution')
    axs[0, 0].set_xlabel('Price')
    axs[0, 0].set_ylabel('Frequency')
    
    # 2. Rating Distribution
    rating_counts = df['rating'].value_counts()
    axs[0, 1].bar(rating_counts.index, rating_counts.values, color='lightgreen')
    axs[0, 1].set_title('Rating Distribution')
    axs[0, 1].set_xlabel('Rating')
    axs[0, 1].set_ylabel('Count')
    
    # 3. Price vs Rating
    rating_map = {'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5}
    df['rating_num'] = df['rating'].map(rating_map)
    axs[1, 0].scatter(df['rating_num'], df['price'], color='coral', alpha=0.6)
    axs[1, 0].set_title('Price vs. Rating')
    axs[1, 0].set_xlabel('Rating (Numerical)')
    axs[1, 0].set_ylabel('Price')
    
    # 4. Availability Status
    status_counts = df['availability'].value_counts()
    axs[1, 1].pie(status_counts.values, labels=status_counts.index, autopct='%1.1f%%', colors=['gold'])
    axs[1, 1].set_title('Product Availability')
    
    plt.tight_layout()
    plt.savefig('output/analysis_dashboard.png')
    plt.show()

if __name__ == "__main__":
    analyze_and_visualize()