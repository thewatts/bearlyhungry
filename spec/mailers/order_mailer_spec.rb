require './spec/spec_helper'

describe Order do
  before(:each) do
    I18n.enforce_available_locales = false
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
    @user = FactoryGirl.create(:user, :guest => false, :email => "asdf@sdg.com")
    @order = FactoryGirl.create(:order, :user_id => @user.id)
    @item = FactoryGirl.create(:item, :id => 1, :price => 10.00)
    @order_item = FactoryGirl.create(:order_item, :order_id => @order.id, :item_id => 1)
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
