class AddScaleToItemPrice < ActiveRecord::Migration
  def change
    change_column :items, :price, :decimal, :precision => 15, :scale => 2
  end
end
