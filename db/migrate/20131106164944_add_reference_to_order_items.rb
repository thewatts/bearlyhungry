class AddReferenceToOrderItems < ActiveRecord::Migration
  def change
    add_reference :order_items, :item, index: true
  end
end
