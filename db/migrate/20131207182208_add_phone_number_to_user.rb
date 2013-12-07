class AddPhoneNumberToUser < ActiveRecord::Migration
  def change
    add_column :users, :phone_number, :number
  end
end
