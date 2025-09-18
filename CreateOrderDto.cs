public class CreateOrderDto
{
    public List<OrderItemDto> OrderItems { get; set; }
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}