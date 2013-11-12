class AddAdminToUser < ActiveRecord::Migration
  def change
    add_column :users, :admin_status, :boolean, :default => :false
  end
end
