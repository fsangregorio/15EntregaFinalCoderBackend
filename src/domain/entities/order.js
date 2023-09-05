
export default class Order {
  constructor(props) {
    this.id = props.id;
    this.purchaser = props.purchaser;
    this.code = props.code;
    this.amount = props.amount;
    this.createdAt = props.createdAt;
    this.status = props.status;
    this.completedAt = props.completedAt;
  }
}
