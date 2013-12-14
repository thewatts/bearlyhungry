class ChangeApprovedToStatusOnRestaurants < ActiveRecord::Migration
  def change
    remove_column :restaurants , :approved
    add_column    :restaurants , :status, :string, :default => "pending"
  end
end
