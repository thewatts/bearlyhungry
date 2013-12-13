class AddIndexToSlugOnRestaurants < ActiveRecord::Migration
  def change
    add_index :restaurants, :slug
  end
end
