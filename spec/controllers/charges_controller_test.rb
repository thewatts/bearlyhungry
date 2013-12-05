require_relative '../spec_helper'

describe ChargesController do
  
  before do
    @order = Order.create(status: "pending")
    @user = User.create(
      email: "test@example.com",
      password: "password",
      password_confirmation: "password",
      full_name: "Example User"
    ) 
    #factory girl?
  end

  describe "#new" do
    context "when charged" do
      expect(response.status).to eq(200)
      redirect_to menu_path
    end
  end

  describe "#create" do
    context "creates a new charge to user" do
  #   post(:create, nil, { order_id: @order.id, user_id: @user.id })
  #   assert_response 302
  #   assert_redirected_to menu_path
  #   # assert_equal "", flash[:successful_transaction]
  #   #controller: "items", action: "index" --> more direct way to redirect test
    end
  end
end
