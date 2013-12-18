class AddRestaurantIdToItemCategories < ActiveRecord::Migration
  def change
    add_reference :item_categories, :restaurant, :index => true
  end
end
