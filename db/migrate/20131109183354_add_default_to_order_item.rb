class AddDefaultToOrderItem < ActiveRecord::Migration
  def change
    change_column :order_items, :quantity, :integer, :default => 1
  end
end
