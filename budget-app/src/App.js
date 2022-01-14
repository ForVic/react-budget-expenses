import Container from "react-bootstrap/Container";
import { Button, Stack } from "react-bootstrap";
import BudgetCard from "./Components/BudgetCard";
import AddBudgetModal from "./Components/AddBudgetModal";
import AddExpenseModal from "./Components/AddExpenseModal";
import UncategorizedBudgetCard from "./Components/UncategorizedBudgetCard";
import TotalBudgetCard from "./Components/TotalBudgetCard";
import { useState } from "react";
import { useBudgets } from "./contexts/BudgetsContexts";
import ViewExpensesModal from "./Components/ViewExpensesModal";
import { UNCATEGORIZED_BUDGET_ID } from "./contexts/BudgetsContexts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [viewExpensesModalBudgteId, setViewExpensesModalBudgetId] = useState();
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState();
  const { budgets, getBudgetExpenses } = useBudgets();
  const [card, setCard] = useState(budgets)

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true);
    setAddExpenseModalBudgetId(budgetId);
  }

  function handleOnDragEnd (result) {
    if (result.destination == null) return;
    const items = Array.from(card);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCard(items)
  }

  return (
    <>
      <Container className="my-4">
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Budgets</h1>
          <Button variant="success" onClick={() => setShowAddBudgetModal(true)}>
            Add Budget
          </Button>
          <Button variant="outline-success" onClick={openAddExpenseModal}>
            Add Expenses
          </Button>
        </Stack>
        <TotalBudgetCard />
        <br></br>
        <UncategorizedBudgetCard
                  onAddExpenseClick={openAddExpenseModal}
                  onViewExpensesClick={() =>
                    setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
                  }
                />
                <br></br>
                <br></br>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="cards">
            {(provided) => (
              <div
                className="cards"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "maskRepeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                {card.map((budget, index) => {
                  const amount = getBudgetExpenses(budget.id).reduce(
                    (total, expense) => total + expense.amount,
                    0
                  );
                  return (
                    <Draggable
                      key={budget.id}
                      draggableId={budget.id}
                      index={index}
                    >
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                          <BudgetCard
                            name={budget.name}
                            amount={amount}
                            max={budget.max}
                            onAddExpenseClick={() =>
                              openAddExpenseModal(budget.id)
                            }
                            onViewExpensesClick={() =>
                              setViewExpensesModalBudgetId(budget.id)
                            }
                          >
                          </BudgetCard>
                          </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <ViewExpensesModal
        budgetId={viewExpensesModalBudgteId}
        handleClose={() => setViewExpensesModalBudgetId()}
      />
    </>
  );
}

export default App;
