class AddCityIdToRestaurant < ActiveRecord::Migration
  def change
    add_column :restaurants, :city_id, :reference
  end
end
