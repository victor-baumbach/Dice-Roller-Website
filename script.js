function DieObject (sides, hasCriticals) {
    this.sides = sides;
    this.critical = hasCriticals;
    this.roll = function () {
        let result = Math.round(Math.random() * (this.sides - 1) + 1);
        if (this.critical) {
            if (result === this.sides) {
                result = "Critical Success! (" + result + ") ";
            }
            else if (result === 1) {
                result = "Critical Failure! (" + result + ") ";
            }
        }
        return result;
    }
}

dissectInput = function (inputString) {
    var results = [];
    var tasks = inputString.split(/(\d*d\d+[bw]?\d*)/gi);
    var resultIndex = 1;
    var output = "\nResult " + resultIndex + ":";
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        const task = tasks[taskIndex];
        if (task) {
            if (task.includes("d")) {
                //Then it is a results task
                let numberOfDice = 1;
                let sidesOfDice = "";
                let bestDice = -1;
                let worstDice = -1;
                let indexOfD = task.indexOf("d");
                let indexOfB = task.indexOf("b");
                let indexOfW = task.indexOf("w");

                if (indexOfD > 0) {
                    numberOfDice = parseInt(task.substring(0, indexOfD));
                }
                else {
                    numberOfDice = 1;
                }
                if (indexOfB > indexOfD) {
                    sidesOfDice = parseInt(task.substring(indexOfD + 1, indexOfB));
                    bestDice = task.substring(indexOfB + 1);
                    if (bestDice === undefined) {
                        bestDice = 1;
                    }
                    else {
                        bestDice = parseInt(bestDice);
                    }
                }
                else if (indexOfW > indexOfD) {
                    sidesOfDice = parseInt(task.substring(indexOfD + 1, indexOfW));
                    worstDice = task.substring(indexOfW + 1);
                    if (worstDice === undefined) {
                        worstDice = 1;
                    }
                    else {
                        worstDice = parseInt(worstDice);
                    }
                }
                else {
                    sidesOfDice = parseInt(task.substring(indexOfD + 1));
                }

                let die = new DieObject(sidesOfDice, sidesOfDice === 20);
                for (let i = 0; i < numberOfDice; i++) {
                    results[i] = die.roll();
                }

                output += "\n" + task + "\n" + results + "\n";

                if (bestDice > 0) {
                    while (bestDice < results.length) {
                        results = removeItem(Math.min(...results), results);
                    }
                }
                else if (worstDice > 0) {
                    while (worstDice < results.length) {
                        results = removeItem(Math.max(...results), results);
                    }
                }

                let total = 0;
                for (let i = 0; i < results.length; i++) {
                    total += results[i];
                }

                output += "\tTotal = " + total;
            }
            else if (task.includes(",")) {
                //Then it is a task/total separator
                resultIndex += 1;
                output += "\nResult " + resultIndex + ":";
            }
            else if (task.includes(" ") || task.includes("+")) {
                //Then it is a combiner
                //Worth considering that it may contain a constant
                output += task;
            }
        }
    }
    return output;
};

function removeItem(value, tail, amount = 1, head = []) {
    if (tail.length === 0) {
        return head;
    }
    else if (amount <= 0) {
        return head.concat(tail);
    }
    else {
        if (tail[0] !== value) {
            head[head.length] = tail[0];
        }
        else {
            amount -= 1;
        }
        return removeItem(value, tail.slice(1), amount, head);
    }
}

function processInput() {
  document.getElementById("txtOutput").value = dissectInput(document.getElementById("inpDiceTray").value);
}