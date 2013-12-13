require './spec/spec_helper'

describe Order do
  before(:each) do
    I18n.enforce_available_locales = false
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
    @user = FactoryGirl.create(:user, :guest => false)
    @order = FactoryGirl.create(:order, :user_id => @user.id)
    @order_item = FactoryGirl.create(:order_item, :order_id => @order.id, :item_id => 1)
    @item = FactoryGirl.create(:item, :id => 1)
    @receipt_items = @order.order_items.each {|order_item|
      hash = {
        title: => order_item.item.title,
        price: => order_item.item.price,
        description: => order_item.item.description
        quantity: => order_item.quantity

      } }

    @email_data = {
      user_email: @user.email,
      user_name: @user.full_name,
      order_total: @order.subtotal,
      order_id: @order.id,
      user_id: @user.id,
      order_status: @order.status,
      created_at: @order.created_at,
      order_items: @reciept_items
    }
  end

  after(:each) do
    ActionMailer::Base.deliveries.clear
  end

  it 'should send an order confirmation email' do
    @order.send_order_confirmation_email
    ActionMailer::Base.deliveries.first.to.should.to_s == @user.email
  end

  xit 'sends an order ready email' do
    @order.send_order_ready_email
    ActionMailer::Base.deliveries.count.should == 1
  end
end
