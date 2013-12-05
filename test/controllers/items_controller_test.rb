require 'test_helper'

class ItemsControllerTest < ActionController::TestCase
  setup do
    @item = items(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:items)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create item" do
    assert_difference('Item.count') do
      post :create, item: { description: @item.description, price: @item.price, title: @item.title }
    end

    assert_redirected_to item_path(assigns(:item))
  end

  test "should show item" do
    get :show, id: @item
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @item
    assert_response :success
  end

  test "should update item" do
    patch :update, id: @item, item: { description: @item.description, price: @item.price, title: @item.title }
    assert_redirected_to item_path(assigns(:item))
  end

  test "should destroy item" do
    assert_difference('Item.count', -1) do
      delete :destroy, id: @item
    end

    assert_redirected_to items_path
  end
end
  # test "it creates an item with title, description and price" do
  #   # visit items page
  #   visit items_path
  #   # click "new item"
  #   click_on "New Item"
  #   # enter title
  #   fill_in "title", :with => "Phonatic"
  #   # # enter description
  #   fill_in "description", :with => "The best soup in town"
  #   # # enter price
  #   fill_in "price", :with => 10.00
  #   # # click "save item"
  #   click_on "Save Item"
  #   within("#items") do
  #     assert page.has_content?("Phonatic")
  #     assert page.has_content?("The best soup in town")
  #   end
  # end

