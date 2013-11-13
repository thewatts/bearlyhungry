class AddAvailableToItem < ActiveRecord::Migration
  def change
    add_column :items, :available, :boolean, :default => true
  end
end
