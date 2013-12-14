class AddNullFalseToJobFields < ActiveRecord::Migration
  def change
    change_column :jobs, :user_id,       :integer, :null => false
    change_column :jobs, :restaurant_id, :integer, :null => false
    change_column :jobs, :role_id,       :integer, :null => false
  end
end
