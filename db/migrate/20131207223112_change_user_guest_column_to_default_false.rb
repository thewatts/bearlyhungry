class ChangeUserGuestColumnToDefaultFalse < ActiveRecord::Migration
  def change
    change_column :users, :guest, :boolean, default: false
  end
end
